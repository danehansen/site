import { initInstance } from "../../utils/customElement";

function onClick(evt) {
  if (!this.checked) {
    this.checked = true;
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

export default class RadioElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, RadioElement.TEMPLATE);
    this._onClick = onClick.bind(this);
  }

  connectedCallback() {
    const { parentNode } = this;
    if (this.parentNode.tagName.toLowerCase() === "label") {
      this._clickListener = this.parentNode;
    } else {
      this._clickListener = this;
    }
    this._clickListener.addEventListener("click", this._onClick);
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

RadioElement.TAG_NAME = "radio-element";
RadioElement.HTML = require("!raw-loader!./RadioElement.html").default;
RadioElement.CSS = require("!raw-loader!./RadioElement.css").default;
