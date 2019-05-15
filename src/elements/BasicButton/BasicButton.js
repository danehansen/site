import { initInstance } from "utils/customElement";

export default class BasicButton extends HTMLElement {
  constructor() {
    super();
    initInstance(this, BasicButton.TEMPLATE);
  }
}

BasicButton.TAG_NAME = "basic-button";
BasicButton.HTML = require("!raw-loader!./BasicButton.html").default;
BasicButton.CSS = require("!raw-loader!./BasicButton.css").default;
