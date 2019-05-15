import { initInstance } from "utils/customElement";

export default class DemoVideoFilters extends HTMLElement {
  constructor() {
    super();
    initInstance(this, DemoVideoFilters.TEMPLATE);
  }

  connectedCallback() {
    if (this.hasAttribute("active")) {
      this._init();
    }
  }

  disconnectedCallback() {
    this._destroy();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
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
    if (this._active) {
      return;
    }
    this._active = true;

    const dependancies = [];
    await Promise.all(
      dependancies.map(str => window.customElements.whenDefined(str))
    );
  }

  _destroy() {
    if (!this._active) {
      return;
    }
    this._active = false;
  }
}

DemoVideoFilters.TAG_NAME = "demo-video-filters";
DemoVideoFilters.HTML = require("!raw-loader!./DemoVideoFilters.html").default;
DemoVideoFilters.CSS = require("!raw-loader!./DemoVideoFilters.css").default;
DemoVideoFilters.observedAttributes = ["active"];
