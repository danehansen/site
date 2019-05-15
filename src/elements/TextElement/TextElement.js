import { initInstance } from "utils/customElement";

export default class TextElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, TextElement.TEMPLATE);
  }
}

TextElement.TAG_NAME = "text-element";
TextElement.HTML = require("!raw-loader!./TextElement.html").default;
TextElement.CSS = require("!raw-loader!./TextElement.css").default;
