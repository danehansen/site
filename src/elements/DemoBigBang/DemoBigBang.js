import { initInstance } from "utils/customElement";

export default class DemoBigBang extends HTMLElement {
  constructor() {
    super();
    initInstance(this, DemoBigBang.TEMPLATE);

    this._onAntimatterChange = this._onAntimatterChange.bind(this);
    this._onBangClick = this._onBangClick.bind(this);
    this._onMaxMassChange = this._onMaxMassChange.bind(this);
    this._onPress = this._onPress.bind(this);
    this._onRelease = this._onRelease.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onSpeedChange = this._onSpeedChange.bind(this);
    this._onTotalMassChange = this._onTotalMassChange.bind(this);
    this._onZoomMinusClick = this._onZoomClick.bind(this, 3 / 4);
    this._onZoomPlusClick = this._onZoomClick.bind(this, 4 / 3);

    this._antimatterGroup = this.shadowRoot.getElementById("antimatter");
    this._bangButton = this.shadowRoot.getElementById("bang");
    this._gravitySimulation = this.shadowRoot.querySelector(
      "gravity-simulation"
    );
    this._maxMassSlider = this.shadowRoot.getElementById("maxMass");
    this._scrollCaptrue = this.shadowRoot.querySelector("scroll-capture");
    this._speedSlider = this.shadowRoot.getElementById("speed");
    this._totalMassSlider = this.shadowRoot.getElementById("totalMass");
    this._zoomMinusButton = this.shadowRoot.getElementById("zoomMinus");
    this._zoomPlusButton = this.shadowRoot.getElementById("zoomPlus");

    this._gravitySimulation.setAttribute("max-mass", this._maxMassSlider.value);
    this._gravitySimulation.setAttribute("speed", this._speedSlider.value);
    this._gravitySimulation.setAttribute(
      "total-mass",
      this._totalMassSlider.value
    );
  }

  connectedCallback() {
    if (this.hasAttribute("active")) {
      this._init();
    }
  }

  disconnectedCallback() {
    this._destroy();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    switch (attributeName) {
      case "active": {
        if (newValue === null) {
          this._destroy();
        } else {
          this._init();
        }
      }
    }
  }

  async _init() {
    if (this._active) {
      return;
    }
    this._active = true;

    const dependancies = [
      "gravity-simulation",
      "range-slider",
      "scroll-capture"
    ];
    await Promise.all(
      dependancies.map(str => window.customElements.whenDefined(str))
    );

    this._gravitySimulation.antimatter = this._antimatterGroup.value === "true";
    this._onResize();
    this._onTotalMassChange();
    this._onMaxMassChange();
    this._onSpeedChange();

    this._antimatterGroup.addEventListener("change", this._onAntimatterChange);
    this._bangButton.addEventListener("click", this._onBangClick);
    this._gravitySimulation.addEventListener("mousedown", this._onPress);
    this._gravitySimulation.addEventListener("mouseup", this._onRelease);
    this._maxMassSlider.addEventListener("input", this._onMaxMassChange);
    this._scrollCaptrue.addEventListener("scroll", this._onScroll);
    this._speedSlider.addEventListener("input", this._onSpeedChange);
    this._totalMassSlider.addEventListener("input", this._onTotalMassChange);
    this._zoomMinusButton.addEventListener("click", this._onZoomMinusClick);
    this._zoomPlusButton.addEventListener("click", this._onZoomPlusClick);
    window.addEventListener("resize", this._onResize);

    this._onBangClick();
  }

  _destroy() {
    if (!this._active) {
      return;
    }
    this._active = false;
    this._gravitySimulation.active = false;

    this._antimatterGroup.removeEventListener(
      "change",
      this._onAntimatterChange
    );
    this._bangButton.removeEventListener("click", this._onBangClick);
    this._gravitySimulation.removeEventListener("mousedown", this._onPress);
    this._gravitySimulation.removeEventListener("mouseup", this._onRelease);
    this._maxMassSlider.removeEventListener("input", this._onMaxMassChange);
    this._scrollCaptrue.removeEventListener("scroll", this._onScroll);
    this._speedSlider.removeEventListener("input", this._onSpeedChange);
    this._totalMassSlider.removeEventListener("input", this._onTotalMassChange);
    this._zoomMinusButton.removeEventListener("click", this._onZoomMinusClick);
    this._zoomPlusButton.removeEventListener("click", this._onZoomPlusClick);
    window.removeEventListener("resize", this._onResize);
  }

  _onResize() {
    const { devicePixelRatio } = window;
    this._gravitySimulation.height = this.offsetHeight * devicePixelRatio;
    this._gravitySimulation.width = this.offsetWidth * devicePixelRatio;
  }

  _onTotalMassChange(evt) {
    this._gravitySimulation.totalMass = this._totalMassSlider.value;
    if (evt) {
      this._onBangClick();
    }
  }

  _onMaxMassChange(evt) {
    this._gravitySimulation.maxMass = this._maxMassSlider.value;
    if (evt) {
      this._onBangClick();
    }
  }

  _onZoomClick(amount, evt) {
    evt.preventDefault();
    this._gravitySimulation.scale *= parseFloat(amount);
  }

  _onSpeedChange(evt) {
    this._gravitySimulation.speed = Math.pow(
      parseFloat(this._speedSlider.value),
      2
    );
  }

  _onAntimatterChange(evt) {
    this._gravitySimulation.antimatter = evt.target.value === "true";
    this._onBangClick();
  }

  _onPress() {
    this._gravitySimulation.className = "grabbing";
    this._gravitySimulation.active = false;
  }

  _onRelease() {
    this._gravitySimulation.className = "";
    this._gravitySimulation.active = true;
  }

  _onBangClick(evt) {
    if (evt) {
      evt.preventDefault();
      this._x = 0;
      this._y = 0;
    }
    this._scrollCaptrue.reset();
    this._gravitySimulation.bang();
  }

  _onScroll(evt) {
    const { target } = evt;
    this._gravitySimulation.x = target.x;
    this._gravitySimulation.y = target.y;
  }
}

DemoBigBang.TAG_NAME = "demo-big-bang";
DemoBigBang.HTML = require("!raw-loader!./DemoBigBang.html").default;
DemoBigBang.CSS = require("!raw-loader!./DemoBigBang.css").default;
DemoBigBang.observedAttributes = ["active"];
