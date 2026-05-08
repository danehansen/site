import { initInstance } from "utils/customElement";
import { getCrop } from "../filterUtils";
import placeholder from './500x500.jpg'

const IMG = new Image();
IMG.onload = function(evt) {
  // console.log('done', evt)
}
IMG.src = placeholder;


export default class GlitchVideo extends HTMLElement {
  constructor() {
    // console.log("GlitchVideo.constructor");
    super();
    initInstance(this, GlitchVideo.TEMPLATE);
    this.render = this.render.bind(this);
    this._init = this._init.bind(this);
    this._destroy = this._destroy.bind(this);
    this._onMutationObserved = this._onMutationObserved.bind(this);

    // TODO: delete
    // this.shadowRoot.querySelector('img').setAttribute('src', placeholder);
  }

  connectedCallback() {
    // console.log("GlitchVideo.connectedCallback");
    this._isConnected = true;
    this._mutationObserver = new MutationObserver(this._onMutationObserved);
    this._mutationObserver.observe(this, {
      childList: true
    });
    this._init();
  }

  disconnectedCallback() {
    // console.log("GlitchVideo.disconnectedCallback");
    this._isConnected = false;
    this._mutationObserve.disconnect();
    this._destroy();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    // console.log("GlitchVideo.attributeChangedCallback");
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
    // return parseFloat(this.getAttribute("fps")) || 30;
    return parseFloat(this.getAttribute("fps")) || 2;
  }

  set fps(value) {
    if (!value || value === "") {
      this.removeAttribute("fps");
    } else {
      this.setAttribute("fps", value);
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
    // console.log("GlitchVideo._init");
    this._destroy();
    if (this._isConnected && !this.disabled) {
      // this._sourceNode = this.querySelector("video");
      this._sourceNode = IMG;
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
    // console.log("GlitchVideo._destroy");
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
    // console.log("GlitchVideo._onMutationObserved");
    for (const mutation of mutationList) {
      switch (mutation.type) {
        case "childList":
          this._init();
          break;
      }
    }
  }

  render() {
    console.log("GlitchVideo.render");

    const { offsetWidth: columns, offsetHeight: rows } = this;
    let imageDataReader;
    try {
      const obj = getCrop({
        columnWidth: 1,
        destHeight: rows,
        destWidth: columns,
        fit: this.fit,
        rowHeight: 1,
        source: this._sourceNode,
        sourceHeight: this._sourceNode.videoHeight || this._sourceNode.height,
        sourceWidth: this._sourceNode.videoWidth || this._sourceNode.width,
      })
      imageDataReader = obj.imageDataReader;
    } catch(err) {
      return;
    }
    console.log(imageDataReader)


    const canvas = this.shadowRoot.querySelector('canvas');
    canvas.width = columns;
    canvas.height = rows;
    const context = canvas.getContext("2d");
    const img = this.shadowRoot.querySelector('img');


    const sx = 0
    const sy = 0
    const sw = IMG.width
    const sh = IMG.height
    const dx = columns * (this._mirror ? -1 : 1)
    const dy = 0
    const dw = columns
    const dh = rows

    // context.drawImage(this._sourceNode, sx, sy, sw, sh, dx, dy, dw, dh);
    context.drawImage(this._sourceNode, sx, sy, sw, sh, 0, 0, dw, dh);
    // context.drawImage(this._sourceNode, 0, 0);


    // context.fillRect(100, 100, 100, 100);
    console.log({dx, dy, dw, dh})

    // let str = '';
    // for (let y = 0; y < rows; y++) {
    //   for (let x = 0; x < columns; x++) {
    //     const xPixel = this.mirror ? columns - x - 1 : x;
    //     str += `<span class="pixel" style="width: ${100 / columns}%; height: ${100 / rows}%; background-color: rgb(${imageDataReader.red(xPixel, y)}, ${imageDataReader.green(xPixel, y)}, ${imageDataReader.blue(xPixel, y)});"></span>`
    //   }
    //   str+=`<br/>`
    // }
    //
    // this.shadowRoot.getElementById("pixelHolder").innerHTML = str;
  }
}

GlitchVideo.TAG_NAME = "glitch-video";
GlitchVideo.HTML = require("!raw-loader!./GlitchVideo.html").default;
GlitchVideo.CSS = require("!raw-loader!./GlitchVideo.css").default;
GlitchVideo.observedAttributes = ["disabled", "fit", "fps", "mirror"];
