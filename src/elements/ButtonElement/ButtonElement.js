import { initInstance } from "../../utils/customElement";

export default class ButtonElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, ButtonElement.TEMPLATE);
  }
}

ButtonElement.TAG_NAME = "button-element";
ButtonElement.HTML = require("!raw-loader!./ButtonElement.html").default;
ButtonElement.CSS = require("!raw-loader!./ButtonElement.css").default;
