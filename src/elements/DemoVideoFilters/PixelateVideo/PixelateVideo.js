import { initInstance } from "utils/customElement";

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
    // const textMeasurerNode = this.shadowRoot.getElementById("textMeasurer");
    // getCharacterData(textMeasurerNode, this.inverse).then(
    //   ({ columnWidth, rowHeight, brightnessMap }) => {
    //     this.shadowRoot.getElementById("asciiHolder").innerHTML = doSomething({
    //       brightnessMap,
    //       columnWidth,
    //       destHeight: this.offsetHeight,
    //       destWidth: this.offsetWidth,
    //       fit: this.fit,
    //       rowHeight,
    //       source: this._sourceNode,
    //       sourceHeight: this._sourceNode.videoHeight,
    //       sourceWidth: this._sourceNode.videoWidth
    //     });
    //   }
    // );
  }
}

PixelateVideo.TAG_NAME = "pixelate-video";
PixelateVideo.HTML = require("!raw-loader!./PixelateVideo.html").default;
PixelateVideo.CSS = require("!raw-loader!./PixelateVideo.css").default;
PixelateVideo.observedAttributes = ["disabled", "fit", "fps"];
