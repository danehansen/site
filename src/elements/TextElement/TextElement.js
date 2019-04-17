import { initInstance } from "../../utils/customElement";

export default class TextElement extends HTMLElement {
  constructor() {
    super();
    // console.log("TextElement.constructor", this.constructor.name);
    initInstance(this, TextElement.TEMPLATE);
  }

  connectedCallback() {
    // console.log("TextElement.connectedCallback");
  }

  disconnectedCallback() {
    // console.log("TextElement.disconnectedCallback");
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    // console.log(
    //   "TextElement.attributeChangedCallback",
    //   attributeName,
    //   oldValue,
    //   newValue,
    //   namespace
    // );
  }
}

TextElement.TAG_NAME = "text-element";
TextElement.HTML = require("!raw-loader!./TextElement.html").default;
TextElement.CSS = require("!raw-loader!./TextElement.css").default;
