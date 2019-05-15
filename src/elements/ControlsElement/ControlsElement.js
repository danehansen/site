import { initInstance } from "utils/customElement";

export default class ControlsElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, ControlsElement.TEMPLATE);
  }
}

ControlsElement.TAG_NAME = "controls-element";
ControlsElement.HTML = require("!raw-loader!./ControlsElement.html").default;
ControlsElement.CSS = require("!raw-loader!./ControlsElement.css").default;
