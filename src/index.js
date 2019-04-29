import "./index.css";
import "./utils/router";
import { initClass } from "./utils/customElement";

for (const customElement of [
  require("./elements/TextElement/TextElement"),
  require("./elements/PageElement/PageElement")
]) {
  initClass(customElement.default);
}
