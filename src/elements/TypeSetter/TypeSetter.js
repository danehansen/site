import { initInstance } from "utils/customElement";

export default class TypeSetter extends HTMLElement {
  constructor() {
    super();
    initInstance(this, TypeSetter.TEMPLATE);
  }
}

TypeSetter.TAG_NAME = "type-setter";
TypeSetter.HTML = require("!raw-loader!./TypeSetter.html").default;
TypeSetter.CSS = require("!raw-loader!./TypeSetter.css").default;
