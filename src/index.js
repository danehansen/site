import "./index.css";
import "./utils/router";
import { initClass } from "./utils/customElement";

for (const customElement of [
  require("./elements/ButtonElement/ButtonElement"),
  require("./elements/modules/BigBangElement/BigBangElement"),
  require("./elements/modules/BigBangElement/UniverseElement/UniverseElement"),
  require("./elements/PageElement/PageElement"),
  require("./elements/RadioElement/RadioElement"),
  require("./elements/ScrollCaptureElement/ScrollCaptureElement"),
  require("./elements/SliderElement/SliderElement"),
  require("./elements/TextElement/TextElement")
]) {
  initClass(customElement.default);
}
