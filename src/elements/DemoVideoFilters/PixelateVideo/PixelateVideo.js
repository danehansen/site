import { initInstance } from "utils/customElement";
import { getCrop } from "../asciiUtils";

export default class PixelateVideo extends HTMLElement {
  constructor() {
    // console.log("PixelateVideo.constructor");
    super();
    initInstance(this, PixelateVideo.TEMPLATE);
    this.render = this.render.bind(this);
    this._init = this._init.bind(this);
    this._destroy = this._destroy.bind(this);
    this._onMutationObserved = this._onMutationObserved.bind(this);
  }

  connectedCallback() {
    // console.log("PixelateVideo.connectedCallback");
    this._isConnected = true;
    this._mutationObserver = new MutationObserver(this._onMutationObserved);
    this._mutationObserver.observe(this, {
      childList: true
    });
    this._init();
  }

  disconnectedCallback() {
    // console.log("PixelateVideo.disconnectedCallback");
    this._isConnected = false;
    this._mutationObserve.disconnect();
    this._destroy();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    // console.log("PixelateVideo.attributeChangedCallback");
    this._init();
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (!value || value === "") {
      this.removeAttribute("disabled");
    } else {
      this.setAttribute("disabled", "");
    }
  }

  get fit() {
    return this.getAttribute("fit");
  }

  set fit(value) {
    if (!value || value === "") {
      this.removeAttribute("fit");
    } else {
      this.setAttribute("fit", value);
    }
  }

  get fps() {
    return parseFloat(this.getAttribute("fps")) || 30;
  }

  set fps(value) {
    if (!value || value === "") {
      this.removeAttribute("fps");
    } else {
      this.setAttribute("fps", value);
    }
  }

  get pixelation() {
    return parseInt(this.getAttribute("pixelation")) || 1;
  }

  set pixelation(value) {
    if (!value || value === "") {
      this.removeAttribute("pixelation");
    } else {
      this.setAttribute("pixelation", value);
    }
  }

  get mirror() {
    return this.hasAttribute("mirror");
  }

  set mirror(value) {
    if (!value || value === "") {
      this.removeAttribute("mirror");
    } else {
      this.setAttribute("mirror", "");
    }
  }

  _init() {
    // console.log("PixelateVideo._init");
    this._destroy();
    if (this._isConnected && !this.disabled) {
      this._sourceNode = this.querySelector("video");
      if (this._sourceNode) {
        this._sourceNode.addEventListener("playing", this._init);
        this._sourceNode.addEventListener("pause", this._destroy);
        if (!this._sourceNode.paused) {
          this._interval = setInterval(this.render, 1000 / this.fps);
        }
      }
    }
  }

  _destroy() {
    // console.log("PixelateVideo._destroy");
    if (this._sourceNode) {
      this._sourceNode.removeEventListener("playing", this._init);
      this._sourceNode.removeEventListener("pause", this._destroy);
      this._sourceNode = null;
    }
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  _onMutationObserved(mutationList) {
    // console.log("PixelateVideo._onMutationObserved");
    for (const mutation of mutationList) {
      switch (mutation.type) {
        case "childList":
          this._init();
          break;
      }
    }
  }

  render() {
    // console.log("PixelateVideo.render");

    const { offsetWidth, offsetHeight, pixelation } = this;
    const columns = Math.round(offsetWidth / pixelation);
    const rows = Math.round(offsetHeight / pixelation);
    const columnWidth = Math.floor(offsetWidth / columns);
    const rowHeight = Math.floor(offsetHeight / rows);

    const {imageDataReader} = getCrop({
      columnWidth,
      destHeight: this.offsetHeight,
      destWidth: this.offsetWidth,
      fit: this.fit,
      rowHeight,
      source: this._sourceNode,
      sourceHeight: this._sourceNode.videoHeight,
      sourceWidth: this._sourceNode.videoWidth,
    })

    let str = '';
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const xPixel = this.mirror ? columns - x - 1 : x;
        str += `<span class="pixel" style="width: ${100 / columns}%; height: ${100 / rows}%; background-color: rgb(${imageDataReader.red(xPixel, y)}, ${imageDataReader.green(xPixel, y)}, ${imageDataReader.blue(xPixel, y)});"></span>`
      }
      str+=`<br/>`
    }

    this.shadowRoot.getElementById("pixelHolder").innerHTML = str;
  }
}

PixelateVideo.TAG_NAME = "pixelate-video";
PixelateVideo.HTML = require("!raw-loader!./PixelateVideo.html").default;
PixelateVideo.CSS = require("!raw-loader!./PixelateVideo.css").default;
PixelateVideo.observedAttributes = ["disabled", "fit", "fps", "mirror", "pixelation"];
