import { initInstance } from "utils/customElement";
import { round } from "@danehansen/math";

const FPS_30 = 1000 / 30;

export default class DemoVideoFilters extends HTMLElement {
  constructor() {
    console.log("DemoVideoFilters.constructor");
    super();
    initInstance(this, DemoVideoFilters.TEMPLATE);

    this._rangeNode = this.shadowRoot.querySelector("range-slider");
    this._radioNode = this.shadowRoot.querySelector("radio-group");
    this._videoNode = this.shadowRoot.querySelector("video");
    this._asciiNode = this.shadowRoot.getElementById("ascii");
    this._codePage437Node = this.shadowRoot.getElementById("codePage437");

    this._permissionGranted = this._permissionGranted.bind(this);
    this._permissionDenied = this._permissionDenied.bind(this);
    this._onLoadedMetaData = this._onLoadedMetaData.bind(this);
    this._onRadioChange = this._onRadioChange.bind(this);
    this._onRangeChange = this._onRangeChange.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  connectedCallback() {
    console.log("DemoVideoFilters.connectedCallback");
    this._init();
  }

  disconnectedCallback() {
    console.log("DemoVideoFilters.disconnectedCallback");
    this._destroy();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    console.log(
      "DemoVideoFilters.attributeChangedCallback",
      attributeName,
      oldValue,
      newValue,
      namespace
    );
    switch (attributeName) {
      case "active": {
        if (newValue === null) {
          this._destroy();
        } else {
          this._init();
        }
      }
    }
  }

  async _init() {
    console.log("DemoVideoFilters._init");
    if (this._active || !this.hasAttribute("active")) {
      return;
    }
    this._active = true;
    const dependancies = ["ascii-video"];
    this._videoNode.setAttribute("autoplay", "");
    await Promise.all(
      dependancies.map(str => window.customElements.whenDefined(str))
    );
    this._promptVideoPermissions();
  }

  _destroy() {
    console.log("DemoVideoFilters._destroy");
    if (!this._active) {
      return;
    }
    this._active = false;
    this._radioNode.removeEventListener("change", this._onRadioChange);
    this._rangeNode.removeEventListener("input", this._onRangeChange);
    this._videoNode.removeAttribute("autoplay");
    this._videoNode.remove();
    window.removeEventListener("resize", this._onResize);
    for (const track of this._videoNode.srcObject.getTracks()) {
      track.stop();
    }
  }

  _promptVideoPermissions() {
    console.log("DemoVideoFilters._promptVideoPermissions");
    window.navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then(this._permissionGranted)
      .catch(this._permissionDenied);
  }

  _permissionGranted(mediaStream) {
    console.log("DemoVideoFilters._permissionGranted");
    this._videoNode.addEventListener("loadedmetadata", this._onLoadedMetaData);
    this._videoNode.srcObject = mediaStream;
  }

  _onLoadedMetaData() {
    console.log("DemoVideoFilters._onLoadedMetaData");
    this._videoNode.removeEventListener(
      "loadedmetadata",
      this._onLoadedMetaData
    );

    this._radioNode.addEventListener("change", this._onRadioChange);
    this._rangeNode.addEventListener("input", this._onRangeChange);
    window.addEventListener("resize", this._onResize);
    this._onRadioChange();
  }

  _permissionDenied(error) {
    console.log("DemoVideoFilters._permissionDenied", error);
  }

  _getRangeValue() {
    const { value } = this._rangeNode;
    let min;
    let max;
    let step;
    switch (this._radioNode.value) {
      case "ascii":
        min = 3;
        max = 100;
        step = 1;
        break;
      case "codePage437":
        min = 3;
        max = 100;
        step = 1;
        break;
    }
    return round(min + (max - min) * value, step);
  }

  _onRadioChange() {
    const { value } = this._radioNode;
    console.log("DemoVideoFilters._onRadioChange", value);
    this._activeNode && this._activeNode.removeAttribute("style");
    switch (value) {
      case "ascii":
        this._activeNode = this._asciiNode;
        break;
      case "codePage437":
        this._activeNode = this._codePage437Node;
        break;
    }
    this._activeNode.appendChild(this._videoNode);
    this._activeNode.style.display = "flex";
    document.fonts.ready.then(this._onResize);
  }

  _onRangeChange() {
    this.style.fontSize = `${this._radioNode.value}px`;
    // console.log("_onRangeChange", this._radioNode.value, this._getRangeValue());
    // switch (this._radioNode.value) {
    //   case "ascii": {
    //     const value = this._getRangeValue();
    //     this._outputNode.style.fontSize = `${value}px`;
    //     this._ci = new CharImage(this._outputNode);
    //     break;
    //   }
    // }
  }

  _onResize() {
    console.log("DemoVideoFilters._onResize");
    this._activeNode.render();
    const { value } = this._radioNode;
    const { offsetHeight, offsetWidth } = this;
    this._rangeNode.value = 1;

    switch (value) {
      case "ascii": {
        // this._rangeNode.value = (16 - 3) / (100 - 3);

        //
        // const sourceColumns = Math.floor(
        //   this._sourceWidth / this._ci.columnWidth
        // );
        // const sourceRows = Math.floor(
        //   this._sourceHeight / this._ci.columnWidth
        // );
        //
        // if (
        //   offsetWidth / offsetHeight >
        //   this._sourceWidth / this._sourceHeight
        // ) {
        //   this._rows = Math.floor(
        //     offsetHeight / Math.floor(this._ci.rowHeight)
        //   );
        //
        //   const rowPixels = this._rows * this._ci.rowHeight;
        //   const columnPixels =
        //     (this._sourceWidth / this._sourceHeight) * rowPixels;
        //   this._columns = Math.floor(columnPixels / this._ci.columnWidth);
        //   // gonna crop off sides of source video
        // } else {
        //   // gonna letterbox source video
        //   this._columns = Math.floor(offsetWidth / this._ci.columnWidth);
        //
        //   const columnPixels = this._columns * this._ci.columnWidth;
        //   const rowPixels =
        //     (this._sourceHeight / this._sourceWidth) * columnPixels;
        //   this._rows = Math.floor(rowPixels / this._ci.rowHeight);
        // }

        break;
      }
      case "codePage437":
        // this._rangeNode.value = (20 - 3) / (100 - 3);
        break;
    }
    this._onRangeChange();
  }
}

DemoVideoFilters.TAG_NAME = "demo-video-filters";
DemoVideoFilters.HTML = require("!raw-loader!./DemoVideoFilters.html").default;
DemoVideoFilters.CSS = require("!raw-loader!./DemoVideoFilters.css").default;
DemoVideoFilters.observedAttributes = ["active"];
