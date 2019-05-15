import { initInstance } from "utils/customElement";
import {
  collisionCheck,
  combine,
  createParticle,
  moveParticle,
  setParticleMass,
  velocitate
} from "../particle";
import { random } from "@danehansen/math";
import Point from "@danehansen/point";

const G = 0.0001;

export default class UniverseElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, UniverseElement.TEMPLATE);
    this._canvas = this.shadowRoot.querySelector("canvas");
    this._ctx = this._canvas.getContext("2d");
    this._bufferCanvas = document.createElement("canvas");
    this._bufferCtx = this._bufferCanvas.getContext("2d");
    this._onTick = this._onTick.bind(this);
    this._toDestroy = [];
  }

  connectedCallback() {}

  disconnectedCallback() {
    if (this._requestAnimationFrameID) {
      window.cancelAnimationFrame(this._requestAnimationFrameID);
      this._requestAnimationFrameID = null;
    }
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    switch (attributeName) {
      case "active":
        this.active = newValue !== null;
        break;
      case "antimatter":
        this.antimatter = newValue !== null;
        break;
      case "height":
        this.height = newValue;
        break;
      case "max-mass":
        this.maxMass = newValue;
        break;
      case "scale":
        this.scale = newValue;
        break;
      case "speed":
        this.speed = newValue;
        break;
      case "total-mass":
        this.totalMass = newValue;
        break;
      case "width":
        this.width = newValue;
        break;
      case "x":
        this.x = newValue;
        break;
      case "y":
        this.y = newValue;
        break;
    }
  }

  get active() {
    return this._active;
  }

  set active(value) {
    const bool = !!value;
    if (bool !== this._active) {
      this._active = bool;
      if (bool) {
        this._onTick();
      } else {
        if (this._requestAnimationFrameID) {
          window.cancelAnimationFrame(this._requestAnimationFrameID);
          this._requestAnimationFrameID = null;
        }
      }
    }
  }

  get antimatter() {
    return this._antimatter;
  }

  set antimatter(value) {
    this._antimatter = !!value;
  }

  get height() {
    return this._height;
  }

  set height(num) {
    num = parseInt(num);
    if (num !== this._height) {
      this._height = num;
      this._centerY = num / 2;
      this._canvas.height = num;
      this._bufferCanvas.height = num;
      this._ctx.globalCompositeOperation = "copy";
    }
  }

  get maxMass() {
    return this._maxMass;
  }

  set maxMass(num) {
    this._maxMass = parseInt(num);
  }

  get scale() {
    return this._scale;
  }

  set scale(num) {
    this._scale = parseFloat(num);
  }

  get speed() {
    return this._speed;
  }

  set speed(num) {
    num = parseFloat(num);
    if (num !== this._speed) {
      this._speed = num;
      if (num !== 0) {
        if (this._particles) {
          const ratio = num / this._speed;
          for (const particle of this._particles) {
            particle.xVel *= ratio;
            particle.yVel *= ratio;
          }
        }
        this._ssg = num * num * G;
      }
    }
  }

  get totalMass() {
    return this._totalMass;
  }

  set totalMass(num) {
    this._totalMass = parseInt(num);
  }

  get width() {
    return this._width;
  }

  set width(num) {
    num = parseInt(num);
    if (num !== this._width) {
      this._width = num;
      this._centerX = num / 2;
      this._canvas.width = num;
      this._bufferCanvas.width = num;
      this._ctx.globalCompositeOperation = "copy";
    }
  }

  get x() {
    return this._x;
  }

  set x(num) {
    this._x = parseInt(num);
  }

  get y() {
    return this._y;
  }

  set y(num) {
    this._y = parseInt(num);
  }

  bang() {
    this.active = false;
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this._particles = [];
    let massTally = 0;
    const maxDistance = Math.min(this._width / 2, this._height / 2);
    while (massTally < this._totalMass) {
      const p = createParticle();
      const len = Math.abs(random(-maxDistance, maxDistance, false, 2));
      const angle = random(Math.PI * 2);
      const point = Point.polar(len, angle);
      p.x = point.x;
      p.y = point.y;
      p.destX = point.x;
      p.destY = point.y;
      setParticleMass(p, random(this._maxMass, -this._maxMass, false, 2));
      if (!this._antimatter) {
        setParticleMass(p, Math.abs(p.mass));
      }
      massTally += Math.abs(p.mass);
      if (massTally > this._totalMass) {
        if (p.mass > 0) {
          p.mass - (massTally - this._totalMass);
        } else {
          p.mass + (massTally - this._totalMass);
        }
      }
      this._particles.push(p);
    }
    this._numParticles = this._particles.length;

    this.active = true;
  }

  _onTick() {
    if (this._speed) {
      //gravitate
      const iLen = this._numParticles - 1;
      for (let i = 0; i < iLen; i++) {
        for (let j = i + 1; j < this._numParticles; j++) {
          this._gravitate(this._particles[i], this._particles[j]);
        }
      }

      //velocitate
      for (const particle of this._particles) {
        velocitate(particle);
      }

      //collision check
      for (let i = 0; i < iLen; i++) {
        const targI = this._particles[i];
        for (let j = i + 1; j < this._numParticles; j++) {
          const targJ = this._particles[j];
          if (collisionCheck(targI, targJ)) {
            combine(targI, targJ);
            this._toDestroy.push(targJ);
          }
        }
      }

      //clean up dead particles
      while (this._toDestroy.length) {
        this._particles.splice(
          this._particles.indexOf(this._toDestroy.shift()),
          1
        );
      }
      this._numParticles = this._particles.length;

      //move particles
      for (const particle of this._particles) {
        moveParticle(particle);
      }
    }
    this.draw();

    if (this._active) {
      this._requestAnimationFrameID = window.requestAnimationFrame(
        this._onTick
      );
    }
  }

  draw() {
    this._bufferCtx.clearRect(0, 0, this._width, this._height);
    for (const particle of this._particles) {
      this._drawParticle(particle);
    }
    this._ctx.drawImage(this._bufferCanvas, 0, 0, this._width, this._height);
  }

  _drawParticle(p) {
    this._bufferCtx.beginPath();
    this._bufferCtx.arc(
      (p.x - this._x) * this._scale + this._centerX,
      (p.y - this._y) * this._scale + this._centerY,
      p.radius * this._scale,
      0,
      2 * Math.PI,
      false
    );
    this._bufferCtx.fillStyle = p.color;
    this._bufferCtx.fill();
  }

  _gravitate(targ1, targ2) {
    const dist = Point.distance(targ1, targ2);
    if (dist > Math.max(targ1.radius, targ2.radius)) {
      const m1 = targ1.mass;
      const m2 = targ2.mass;
      const m1a = Math.abs(m1);
      const f = ((m1 * m2) / Math.pow(dist, 2)) * this._ssg;
      const ratio = m1a / (m1a + Math.abs(m2));
      const xDiff = targ2.x - targ1.x;
      const yDiff = targ2.y - targ1.y;
      const angle = Math.atan2(yDiff, xDiff);
      const interp1 = Point.polar(f * (1 - ratio), angle);
      targ1.destX += interp1.x;
      targ1.destY += interp1.y;
      const interp2 = Point.polar(f * ratio, angle + Math.PI);
      targ2.destX += interp2.x;
      targ2.destY += interp2.y;
    }
  }
}

UniverseElement.TAG_NAME = "universe-element";
UniverseElement.HTML = require("!raw-loader!./UniverseElement.html").default;
UniverseElement.CSS = require("!raw-loader!./UniverseElement.css").default;
UniverseElement.observedAttributes = [
  "active",
  "antimatter",
  "height",
  "max-mass",
  "scale",
  "speed",
  "total-mass",
  "width",
  "x",
  "y"
];
