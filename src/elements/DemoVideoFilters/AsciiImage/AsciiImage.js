import { initInstance } from "utils/customElement";
import { doSomething, dataToString, getCharacterData } from "../asciiUtils";

export default class AsciiImage extends HTMLElement {
  constructor() {
    super();
    initInstance(this, AsciiImage.TEMPLATE);
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    this._isConnected = true;
    this.render();
  }

  disconnectedCallback() {
    this._isConnected = false;
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    this.render();
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

  get src() {
    return this.getAttribute("src");
  }

  set src(value) {
    if (!value || value === "") {
      this.removeAttribute("src");
    } else {
      this.setAttribute("src", value);
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

  get inverse() {
    return this.hasAttribute("inverse");
  }

  set inverse(value) {
    if (!value || value === "") {
      this.removeAttribute("inverse");
    } else {
      this.setAttribute("inverse", "");
    }
  }

  render() {
    const { src } = this;
    if (!this._isConnected || this.disabled || !src) {
      return;
    }

    const textMeasurerNode = this.shadowRoot.getElementById("textMeasurer");
    const source = new Image();
    source.src = src;
    source
      .decode()
      .then(getCharacterData.bind(null, textMeasurerNode, this.inverse))
      .then(({ columnWidth, rowHeight, brightnessMap }) => {
        this.shadowRoot.getElementById("asciiHolder").innerHTML = doSomething({
          brightnessMap,
          columnWidth,
          destHeight: this.offsetHeight,
          destWidth: this.offsetWidth,
          fit: this.fit,
          rowHeight,
          source,
          sourceHeight: source.height,
          sourceWidth: source.width
        });
      });
  }
}

AsciiImage.TAG_NAME = "ascii-image";
AsciiImage.HTML = require("!raw-loader!./AsciiImage.html").default;
AsciiImage.CSS = require("!raw-loader!./AsciiImage.css").default;
AsciiImage.observedAttributes = ["disabled", "fit", "inverse", "src"];
