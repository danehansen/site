import "index.css";
import "utils/router";
import { initClass } from "utils/customElement";

for (const customElement of [
  require("elements/BasicButton/BasicButton"),
  require("elements/ControlGroup/ControlGroup"),
  require("elements/DemoBigBang/DemoBigBang"),
  require("elements/DemoBigBang/GravitySimulation/GravitySimulation"),
  require("elements/DemoVideoFilters/DemoVideoFilters"),
  require("elements/TreeBranch/TreeBranch"),
  require("elements/RadioButton/RadioButton"),
  require("elements/RadioGroup/RadioGroup"),
  require("elements/ScrollCapture/ScrollCapture"),
  require("elements/RangeSlider/RangeSlider"),
  require("elements/TypeSetter/TypeSetter"),
  require("elements/DemoVideoFilters/AsciiImage/AsciiImage"),
  require("elements/DemoVideoFilters/AsciiVideo/AsciiVideo")
]) {
  initClass(customElement.default);
}
