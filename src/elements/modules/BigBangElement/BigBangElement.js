import { initInstance } from "utils/customElement";

export default class BigBangElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, BigBangElement.TEMPLATE);
    this._onTotalMassChange = this._onTotalMassChange.bind(this);
    this._onMaxMassChange = this._onMaxMassChange.bind(this);
    this._onSpeedChange = this._onSpeedChange.bind(this);
    this._onAntimatterChange = this._onAntimatterChange.bind(this);
    this._onBangClick = this._onBangClick.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onPress = this._onPress.bind(this);
    this._onRelease = this._onRelease.bind(this);
    this._onZoomPlusClick = this._onZoomClick.bind(this, 4 / 3);
    this._onZoomMinusClick = this._onZoomClick.bind(this, 3 / 4);
    this._onScroll = this._onScroll.bind(this);

    this._totalMassInput = this.shadowRoot.getElementById("totalMass");
    this._maxMassInput = this.shadowRoot.getElementById("maxMass");
    this._speedInput = this.shadowRoot.getElementById("speed");
    this._antimatterHolder = this.shadowRoot.getElementById("antimatter");
    this._zoomPlusButton = this.shadowRoot.getElementById("zoomPlus");
    this._zoomMinusButton = this.shadowRoot.getElementById("zoomMinus");
    this._bangButton = this.shadowRoot.getElementById("bang");
    this._universe = this.shadowRoot.querySelector("universe-element");
    this._scrollCaptrueElement = this.shadowRoot.querySelector(
      "scroll-capture-element"
    );

    this._universe.setAttribute("max-mass", this._maxMassInput.value);
    this._universe.setAttribute("speed", this._speedInput.value);
    this._universe.setAttribute("total-mass", this._totalMassInput.value);
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
      "scroll-capture-element",
      "slider-element",
      "universe-element"
    ];
    await Promise.all(
      dependancies.map(str => window.customElements.whenDefined(str))
    );

    this._universe.antimatter = this._antimatterHolder.value === "true";
    this._onResize();
    this._onTotalMassChange();
    this._onMaxMassChange();
    this._onSpeedChange();

    this._totalMassInput.addEventListener("input", this._onTotalMassChange);
    this._maxMassInput.addEventListener("input", this._onMaxMassChange);
    this._speedInput.addEventListener("input", this._onSpeedChange);
    this._zoomPlusButton.addEventListener("click", this._onZoomPlusClick);
    this._zoomMinusButton.addEventListener("click", this._onZoomMinusClick);
    this._antimatterHolder.addEventListener("change", this._onAntimatterChange);
    this._bangButton.addEventListener("click", this._onBangClick);
    window.addEventListener("resize", this._onResize);

    this._universe.addEventListener("mousedown", this._onPress);
    this._universe.addEventListener("mouseup", this._onRelease);

    this._scrollCaptrueElement.addEventListener("scroll", this._onScroll);

    this._onBangClick();
  }

  _destroy() {
    if (!this._active) {
      return;
    }
    this._active = false;
    this._universe.active = false;

    this._scrollCaptrueElement.removeEventListener("scroll", this._onScroll);
    this._totalMassInput.removeEventListener("input", this._onTotalMassChange);
    this._maxMassInput.removeEventListener("input", this._onMaxMassChange);
    this._speedInput.removeEventListener("input", this._onSpeedChange);
    this._zoomPlusButton.removeEventListener("click", this._onZoomPlusClick);
    this._zoomMinusButton.removeEventListener("click", this._onZoomMinusClick);
    this._antimatterHolder.removeEventListener(
      "change",
      this._onAntimatterChange
    );
    this._bangButton.removeEventListener("click", this._onBangClick);
    window.removeEventListener("resize", this._onResize);

    this._universe.removeEventListener("mousedown", this._onPress);
    this._universe.removeEventListener("mouseup", this._onRelease);
  }

  _onResize() {
    const { devicePixelRatio } = window;
    this._universe.width = this.offsetWidth * devicePixelRatio;
    this._universe.height = this.offsetHeight * devicePixelRatio;
  }

  _onTotalMassChange(evt) {
    this._universe.totalMass = this._totalMassInput.value;
    if (evt) {
      this._onBangClick();
    }
  }

  _onMaxMassChange(evt) {
    this._universe.maxMass = this._maxMassInput.value;
    if (evt) {
      this._onBangClick();
    }
  }

  _onZoomClick(amount, evt) {
    evt.preventDefault();
    this._universe.scale *= parseFloat(amount);
  }

  _onSpeedChange(evt) {
    this._universe.speed = Math.pow(parseFloat(this._speedInput.value), 2);
  }

  _onAntimatterChange(evt) {
    this._universe.antimatter = evt.target.value === "true";
    this._onBangClick();
  }

  _onPress() {
    this._universe.className = "grabbing";
    this._universe.active = false;
  }

  _onRelease() {
    this._universe.className = "";
    this._universe.active = true;
  }

  _onBangClick(evt) {
    if (evt) {
      evt.preventDefault();
      this._x = 0;
      this._y = 0;
    }
    this._scrollCaptrueElement.reset();
    this._universe.bang();
  }

  _onScroll(evt) {
    const { target } = evt;
    this._universe.x = target.x;
    this._universe.y = target.y;
  }
}

BigBangElement.TAG_NAME = "big-bang-element";
BigBangElement.HTML = require("!raw-loader!./BigBangElement.html").default;
BigBangElement.CSS = require("!raw-loader!./BigBangElement.css").default;
BigBangElement.observedAttributes = ["active"];
