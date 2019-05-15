import { initInstance } from "utils/customElement";

function onChange(evt) {
  this.setAttribute("value", evt.currentTarget.value);
}

function onInput(evt) {
  this.setAttribute("value", evt.currentTarget.value);
}

export default class SliderElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, SliderElement.TEMPLATE);

    this._onChange = onChange.bind(this);
    this._onInput = onInput.bind(this);
    this._inputElement = this.shadowRoot.querySelector("input");
    for (const attr of SliderElement.observedAttributes) {
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

SliderElement.TAG_NAME = "slider-element";
SliderElement.HTML = require("!raw-loader!./SliderElement.html").default;
SliderElement.CSS = require("!raw-loader!./SliderElement.css").default;
SliderElement.observedAttributes = ["max", "min", "step", "value"];
