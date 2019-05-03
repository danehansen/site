import "./index.css";
import "./utils/router";
import { initClass } from "./utils/customElement";

for (const customElement of [
  require("./elements/RadioElement/RadioElement"),
  require("./elements/SliderElement/SliderElement"),
  require("./elements/TextElement/TextElement"),
  require("./elements/ButtonElement/ButtonElement"),
  require("./elements/PageElement/PageElement"),
  require("./elements/BigBangElement/BigBangElement")
]) {
  initClass(customElement.default);
}
