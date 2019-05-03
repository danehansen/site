import {
  collisionCheck,
  combine,
  createParticle,
  moveParticle,
  setParticleMass,
  velocitate
} from "./particle";
import { random } from "@danehansen/math";
import Point from "@danehansen/point";

const G = 0.0001;

export default class Universe {
  constructor(element) {
    this._pause = false;
    this._element = element;
    this._ctx = element.getContext("2d");
    this.totalMass = 10000;
    this.maxMass = 500;
    this._speed = 1;
    this.antimatter = false;
    this._width;
    this._height;
    this.scale = 1;
    this._particles;
    this._ticking = false;
    this._onTick = this._onTick.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.x;
    this.y;
    this._toDestroy = [];
    this._numParticles;
    this._centerX;
    this._centerY;
    this._hasSpeed = true;
    this._pixelRatio = window.devicePixelRatio;
  }

  bang() {
    this._pause = false;
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this._particles = [];
    let massTally = 0;
    const maxDistance = Math.min(this._width / 2, this._height / 2);
    while (massTally < this.totalMass) {
      const p = createParticle();
      const len = Math.abs(random(-maxDistance, maxDistance, false, 2));
      const angle = random(Math.PI * 2);
      const point = Point.polar(len, angle);
      p.x = point.x;
      p.y = point.y;
      p.destX = point.x;
      p.destY = point.y;
      setParticleMass(
        p,
        random(this.maxMass, -this.maxMass, false, 2),
        this._pixelRatio
      );
      if (!this.antimatter) {
        setParticleMass(p, Math.abs(p.mass), this._pixelRatio);
      }
      massTally += Math.abs(p.mass);
      if (massTally > this.totalMass) {
        if (p.mass > 0) {
          p.mass - (massTally - this.totalMass);
        } else {
          p.mass + (massTally - this.totalMass);
        }
      }
      this._particles.push(p);
    }
    this._numParticles = this._particles.length;
    this.start();
  }

  get width() {
    return this._width / this._pixelRatio;
  }

  set width(num) {
    this._width = num * this._pixelRatio;
    this._centerX = (num * this._pixelRatio) / 2;
    this._element.width = num * this._pixelRatio;
  }

  get height() {
    return this._height / this._pixelRatio;
  }

  set height(num) {
    this._height = num * this._pixelRatio;
    this._centerY = (num * this._pixelRatio) / 2;
    this._element.height = num * this._pixelRatio;
  }

  get speed() {
    return this._speed;
  }

  set speed(num) {
    if (num) {
      this._hasSpeed = true;
      for (let i = 0; i < this._numParticles; i++) {
        const p = this._particles[i];
        const ratio = num / this._speed;
        p.xVel *= ratio;
        p.yVel *= ratio;
      }
      this._speed = num;
      this._ssg = num * num * G * this._pixelRatio;
    } else {
      this._hasSpeed = false;
    }
  }

  start() {
    this._ticking = true;
    this._onTick();
  }

  stop() {
    this._ticking = false;
  }

  _onTick() {
    if (this._hasSpeed) {
      //gravitate
      const iLen = this._numParticles - 1;
      for (let i = 0; i < iLen; i++) {
        for (let j = i + 1; j < this._numParticles; j++) {
          this._gravitate(this._particles[i], this._particles[j]);
        }
      }

      //velocitate
      for (let i = 0; i < this._numParticles; i++) {
        velocitate(this._particles[i]);
      }

      //collision check
      for (let i = 0; i < iLen; i++) {
        const targI = this._particles[i];
        for (let j = i + 1; j < this._numParticles; j++) {
          const targJ = this._particles[j];
          if (collisionCheck(targI, targJ)) {
            combine(targI, targJ, this._pixelRatio);
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

      //move and draw
      this._ctx.clearRect(0, 0, this._width, this._height);
      for (let i = 0; i < this._numParticles; i++) {
        const targI = this._particles[i];
        moveParticle(targI);
        this.drawParticle(targI);
      }
    }

    if (this._ticking && !this._pause) {
      window.requestAnimationFrame(this._onTick);
    }
  }

  draw() {
    this._ctx.clearRect(0, 0, this._width, this._height);
    for (let i = 0; i < this._numParticles; i++) {
      this.drawParticle(this._particles[i]);
    }
  }

  drawParticle(p) {
    this._ctx.beginPath();
    this._ctx.arc(
      (p.x + this.x) * this.scale + this._centerX,
      (p.y + this.y) * this.scale + this._centerY,
      p.radius * this.scale,
      0,
      2 * Math.PI,
      false
    );
    this._ctx.fillStyle = p.color;
    this._ctx.fill();
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
