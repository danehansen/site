import { initInstance } from "utils/customElement";

export default class ControlGroup extends HTMLElement {
  constructor() {
    super();
    initInstance(this, ControlGroup.TEMPLATE);
  }
}

ControlGroup.TAG_NAME = "control-group";
ControlGroup.HTML = require("!raw-loader!./ControlGroup.html").default;
ControlGroup.CSS = require("!raw-loader!./ControlGroup.css").default;
