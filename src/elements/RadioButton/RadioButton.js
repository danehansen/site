import "./RadioButtonGlobal.css";
import { initInstance } from "utils/customElement";

function onClick(evt) {
  if (!this.checked) {
    this.checked = true;
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export default class RadioButton extends HTMLElement {
  constructor() {
    super();
    initInstance(this, RadioButton.TEMPLATE);
    this._onClick = onClick.bind(this);
  }

  connectedCallback() {
    this.addEventListener("click", this._onClick);
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set checked(value) {
    const bool = !!value;
    const attrBool = this.hasAttribute("checked");
    if (bool !== attrBool) {
      if (bool) {
        this.setAttribute("checked", "");
      } else {
        this.removeAttribute("checked");
      }
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

RadioButton.TAG_NAME = "radio-button";
RadioButton.HTML = require("!raw-loader!./RadioButton.html").default;
RadioButton.CSS = require("!raw-loader!./RadioButton.css").default;
