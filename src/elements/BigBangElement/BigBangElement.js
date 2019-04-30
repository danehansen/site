import { initInstance } from "../../utils/customElement";

export default class BigBangElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, BigBangElement.TEMPLATE);
  }

  connectedCallback() {
    if (this.getAttribute("selected") !== null) {
      this._init();
    }
  }

  disconnectedCallback() {
    this._destroy();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    switch (attributeName) {
      case "selected": {
        if (newValue !== null) {
          this._init();
        } else if (newValue === null) {
          this._destroy();
        }
      }
    }
  }

  _init() {
    if (!this._active) {
      this._active = true;
      this._setInterval = setInterval(() => {
        console.log(`interval`, this.parentNode.href);
      }, 1000);
    }
  }

  _destroy() {
    if (this._active) {
      this._active = false;
      clearInterval(this._setInterval);
    }
  }
}

BigBangElement.TAG_NAME = "big-bang-element";
BigBangElement.HTML = require("!raw-loader!./BigBangElement.html").default;
BigBangElement.CSS = require("!raw-loader!./BigBangElement.css").default;
BigBangElement.observedAttributes = ["selected"];
