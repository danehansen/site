import { initInstance } from "utils/customElement";

function onChange(evt) {
  this.setAttribute("value", evt.currentTarget.value);
}

function onInput(evt) {
  this.setAttribute("value", evt.currentTarget.value);
}

export default class RangeSlider extends HTMLElement {
  constructor() {
    super();
    initInstance(this, RangeSlider.TEMPLATE);

    this._onChange = onChange.bind(this);
    this._onInput = onInput.bind(this);
    this._inputElement = this.shadowRoot.querySelector("input");
    for (const attr of RangeSlider.observedAttributes) {
      this._inputElement.setAttribute(attr, this.getAttribute(attr));
    }
  }

  connectedCallback() {
    this._inputElement.addEventListener("change", this._onChange);
    this._inputElement.addEventListener("input", this._onInput);
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    this._inputElement.setAttribute(attributeName, newValue);
  }

  get min() {
    return parseFloat(this.getAttribute("min"));
  }

  set min(value) {
    this.setAttribute("min", value);
  }

  get max() {
    return parseFloat(this.getAttribute("max"));
  }

  set max(value) {
    this.setAttribute("max", value);
  }

  get value() {
    return parseFloat(this.getAttribute("value"));
  }

  set value(v) {
    this.setAttribute("value", v);
  }

  get step() {
    return parseFloat(this.getAttribute("step"));
  }

  set step(value) {
    this.setAttribute("step", value);
  }
}

RangeSlider.TAG_NAME = "range-slider";
RangeSlider.HTML = require("!raw-loader!./RangeSlider.html").default;
RangeSlider.CSS = require("!raw-loader!./RangeSlider.css").default;
RangeSlider.observedAttributes = ["max", "min", "step", "value"];
