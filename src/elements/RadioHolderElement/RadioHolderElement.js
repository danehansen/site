import { initInstance } from "../../utils/customElement";

function onChange(evt) {
  const { target } = evt;
  if (target.tagName.toLowerCase() === "radio-element") {
    evt.stopImmediatePropagation();
    this._value = target.value;
    this.dispatchEvent(new Event("change"));
    const children = this.querySelectorAll("radio-element");
    for (const child of this.querySelectorAll("radio-element")) {
      if (child !== target) {
        child.checked = false;
      }
    }
  }
}

export default class RadioHolderElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, RadioHolderElement.TEMPLATE);
    this._onChange = onChange.bind(this);
  }

  connectedCallback() {
    this.addEventListener("change", this._onChange);
    for (const child of this.querySelectorAll("radio-element")) {
      if (child.checked === true) {
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

RadioHolderElement.TAG_NAME = "radio-holder-element";
RadioHolderElement.HTML = require("!raw-loader!./RadioHolderElement.html").default;
RadioHolderElement.CSS = require("!raw-loader!./RadioHolderElement.css").default;
