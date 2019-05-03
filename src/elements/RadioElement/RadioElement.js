import { initInstance } from "../../utils/customElement";

function onClick(evt) {
  if (!this._isChecked) {
    this.checked = true;
  }
}

export default class RadioElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, RadioElement.TEMPLATE);
    this._checkedAttr = this.getAttribute("checked");
    this._onClick = onClick.bind(this);
  }

  connectedCallback() {
    this.addEventListener("click", this._onClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    if (attributeName === "checked") {
      this._checkedAttr = newValue;
    }
  }

  get checked() {
    return this._checkedAttr !== null;
  }

  set checked(value) {
    const bool = !!value;
    const attrBool = this._checkedAttr !== null;
    if (bool !== attrBool) {
      if (bool) {
        this.setAttribute("checked", "");
        this._att;
      } else {
        this.removeAttribute("checked");
      }
      this.dispatchEvent(new Event("change"));
    }
  }

  get value() {
    return this.getAttribute("value");
  }

  set value(v) {
    if (v !== this.getAttribute("value")) {
      if (v === null) {
        this.removeAttribute("value");
      } else {
        this.setAttribute("value", v);
      }
    }
  }

  get name() {
    return this.getAttribute("name");
  }

  set name(v) {
    if (v !== this.getAttribute("name")) {
      if (v === null) {
        this.removeAttribute("name");
      } else {
        this.setAttribute("name", v);
      }
    }
  }
}

RadioElement.TAG_NAME = "radio-element";
RadioElement.HTML = require("!raw-loader!./RadioElement.html").default;
RadioElement.CSS = require("!raw-loader!./RadioElement.css").default;
RadioElement.observedAttributes = ["checked"];
