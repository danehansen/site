import { initInstance } from "utils/customElement";

function onChange(evt) {
  const { target } = evt;
  this._value = target.value;
  for (const child of this.children) {
    if (child !== target && child.value !== undefined) {
      child.checked = false;
    }
  }
}

export default class RadioGroupElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, RadioGroupElement.TEMPLATE);
    this._onChange = onChange.bind(this);
  }

  connectedCallback() {
    this.addEventListener("change", this._onChange);
    for (const child of this.children) {
      if (child.checked === true && child.value !== undefined) {
        this._value = child.value;
      }
    }
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v;
  }
}

RadioGroupElement.TAG_NAME = "radio-group-element";
RadioGroupElement.HTML = require("!raw-loader!./RadioGroupElement.html").default;
RadioGroupElement.CSS = require("!raw-loader!./RadioGroupElement.css").default;
