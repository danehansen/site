import { initInstance } from "utils/customElement";
import { round } from "@danehansen/math";

const FPS_30 = 1000 / 30;

export default class DemoVideoFilters extends HTMLElement {
  constructor() {
    // console.log("DemoVideoFilters.constructor");
    super();
    initInstance(this, DemoVideoFilters.TEMPLATE);

    this._radioNode = this.shadowRoot.querySelector("radio-group");
    this._videoNode = this.shadowRoot.querySelector("video");
    this._asciiNode = this.shadowRoot.getElementById("ascii");
    this._codePage437Node = this.shadowRoot.getElementById("codePage437");

    this._permissionGranted = this._permissionGranted.bind(this);
    this._permissionDenied = this._permissionDenied.bind(this);
    this._onLoadedMetaData = this._onLoadedMetaData.bind(this);
    this._onRadioChange = this._onRadioChange.bind(this);
  }

  connectedCallback() {
    // console.log("DemoVideoFilters.connectedCallback");
    this._init();
  }

  disconnectedCallback() {
    // console.log("DemoVideoFilters.disconnectedCallback");
    this._destroy();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    // console.log(
    //   "DemoVideoFilters.attributeChangedCallback",
    //   attributeName,
    //   oldValue,
    //   newValue,
    //   namespace
    // );
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
    // console.log("DemoVideoFilters._init");
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
    // console.log("DemoVideoFilters._destroy");
    if (!this._active) {
      return;
    }
    this._active = false;
    this._radioNode.removeEventListener("change", this._onRadioChange);
    this._videoNode.removeAttribute("autoplay");
    this._videoNode.remove();
    for (const track of this._videoNode.srcObject.getTracks()) {
      track.stop();
    }
  }

  _promptVideoPermissions() {
    // console.log("DemoVideoFilters._promptVideoPermissions");
    window.navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then(this._permissionGranted)
      .catch(this._permissionDenied);
  }

  _permissionGranted(mediaStream) {
    // console.log("DemoVideoFilters._permissionGranted");
    this._videoNode.addEventListener("loadedmetadata", this._onLoadedMetaData);
    this._videoNode.srcObject = mediaStream;
  }

  _onLoadedMetaData() {
    // console.log("DemoVideoFilters._onLoadedMetaData");
    this._videoNode.removeEventListener(
      "loadedmetadata",
      this._onLoadedMetaData
    );

    this._radioNode.addEventListener("change", this._onRadioChange);
    this._onRadioChange();
  }

  _permissionDenied(error) {
    console.log("DemoVideoFilters._permissionDenied", error);
  }

  _onRadioChange() {
    const { value } = this._radioNode;
    // console.log("DemoVideoFilters._onRadioChange", value);
    this._activeNode && this._activeNode.removeAttribute("style");
    switch (value) {
      case "ascii":
        this._activeNode = this._asciiNode;
        break;
      case "codePage437":
        this._activeNode = this._codePage437Node;
        break;
    }
    this._activeNode.style.display = "flex";
    this._activeNode.appendChild(this._videoNode);
  }
}

DemoVideoFilters.TAG_NAME = "demo-video-filters";
DemoVideoFilters.HTML = require("!raw-loader!./DemoVideoFilters.html").default;
DemoVideoFilters.CSS = require("!raw-loader!./DemoVideoFilters.css").default;
DemoVideoFilters.observedAttributes = ["active"];
