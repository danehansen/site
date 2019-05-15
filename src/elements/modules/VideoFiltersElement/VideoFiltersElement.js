import { initInstance } from "utils/customElement";

export default class VideoFiltersElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, VideoFiltersElement.TEMPLATE);
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

VideoFiltersElement.TAG_NAME = "video-filters-element";
VideoFiltersElement.HTML = require("!raw-loader!./VideoFiltersElement.html").default;
VideoFiltersElement.CSS = require("!raw-loader!./VideoFiltersElement.css").default;
VideoFiltersElement.observedAttributes = ["active"];
