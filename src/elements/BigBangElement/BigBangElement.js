import { initInstance } from "../../utils/customElement";
import Universe from "./Universe";

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
    this._onZoomPlusClick = this._onZoomClick.bind(this, 4 / 3);
    this._onZoomMinusClick = this._onZoomClick.bind(this, 3 / 4);

    this._canvas = this.shadowRoot.querySelector("canvas");
    this._totalMassInput = this.shadowRoot.getElementById("totalMass");
    this._maxMassInput = this.shadowRoot.getElementById("maxMass");
    this._speedInput = this.shadowRoot.getElementById("speed");
    this._antimatterYesInput = this.shadowRoot.getElementById("antimatterYes");
    this._antimatterNoInput = this.shadowRoot.getElementById("antimatterNo");
    this._zoomPlusButton = this.shadowRoot.getElementById("zoomPlus");
    this._zoomMinusButton = this.shadowRoot.getElementById("zoomMinus");
    this._bangButton = this.shadowRoot.getElementById("bang");
    this._universe = new Universe(this._canvas);
  }

  connectedCallback() {
    if (this.getAttribute("active") !== null) {
      this._init();
    }
  }

  disconnectedCallback() {
    this._destroy();
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    switch (attributeName) {
      case "active": {
        if (newValue !== null) {
          this._init();
        } else if (newValue === null) {
          this._destroy();
        }
      }
    }
  }

  _init() {
    if (this._active) {
      return;
    }
    this._active = true;

    this._onResize();
    this._onTotalMassChange();
    this._onMaxMassChange();
    this._onSpeedChange();
    this._onAntimatterChange();

    this._totalMassInput.addEventListener("input", this._onTotalMassChange);
    this._maxMassInput.addEventListener("input", this._onMaxMassChange);
    this._speedInput.addEventListener("input", this._onSpeedChange);
    this._zoomPlusButton.addEventListener("click", this._onZoomPlusClick);
    this._zoomMinusButton.addEventListener("click", this._onZoomMinusClick);
    this._antimatterYesInput.addEventListener(
      "change",
      this._onAntimatterChange
    );
    this._antimatterNoInput.addEventListener(
      "change",
      this._onAntimatterChange
    );
    this._bangButton.addEventListener("click", this._onBangClick);
    window.addEventListener("resize", this._onResize);

    this._onBangClick();
    this._setDragger();
  }

  _destroy() {
    if (!this._active) {
      return;
    }
    this._active = true;
    this._universe.stop();

    this._totalMassInput.removeEventListener("input", this._onTotalMassChange);
    this._maxMassInput.removeEventListener("input", this._onMaxMassChange);
    this._speedInput.removeEventListener("input", this._onSpeedChange);
    this._zoomPlusButton.removeEventListener("click", this._onZoomPlusClick);
    this._zoomMinusButton.removeEventListener("click", this._onZoomMinusClick);
    this._antimatterYesInput.removeEventListener(
      "change",
      this._onAntimatterChange
    );
    this._antimatterNoInput.removeEventListener(
      "change",
      this._onAntimatterChange
    );
    this._bangButton.removeEventListener("click", this._onBangClick);
    window.removeEventListener("resize", this._onResize);
  }

  _onResize() {
    this._universe.width = window.innerWidth;
    this._universe.height = window.innerHeight;
  }

  _onTotalMassChange(evt) {
    this._universe.totalMass = parseFloat(this._totalMassInput.value);
    if (evt) {
      this._onBangClick();
    }
  }

  _onMaxMassChange(evt) {
    this._universe.maxMass = parseFloat(this._maxMassInput.value);
    if (evt) {
      this._onBangClick();
    }
  }

  _onZoomClick(amount, evt) {
    // evt.preventDefault();
    // this._scale *= parseFloat(amount);
    // TweenLite.to(this._universe, 0.3, { scale: this._scale });
  }

  _onSpeedChange(evt) {
    this._universe.speed = Math.pow(parseFloat(this._speedInput.value), 2);
  }

  _onAntimatterChange(evt) {
    this._universe.antimatter = this._antimatterYesInput.checked;
    if (evt) {
      this._onBangClick();
    }
  }

  _setDragger() {
    // if (draggable) {
    //   draggable.kill();
    //   TweenLite.set(".invisible", { clearProps: "all" });
    // }
    // draggable = new Draggable(".invisible", {
    //   throwProps: true,
    //   trigger: canvas,
    //   onPress: onPress,
    //   onDrag: onDrag,
    //   onRelease: onRelease,
    //   zIndexBoost: false,
    //   onThrowUpdate: onDrag,
    //   cursor: "grab"
    // });
  }

  _onPress() {
    //   canvas.className = "grabbing";
    //   universe.stop();
  }
  //
  _onRelease() {
    //   canvas.className = "";
    //   universe.start();
  }

  _onBangClick(evt) {
    if (evt) {
      evt.preventDefault();
      this._scale = 1;
      this._x = 0;
      this._y = 0;
      this._setDragger();
    }
    this._universe.bang();
  }

  _onDrag() {
    //   var diffX = draggable.x - x;
    //   var diffY = draggable.y - y;
    //   x = draggable.x;
    //   y = draggable.y;
    //   universe.x = universe.x + diffX / scale;
    //   universe.y = universe.y + diffY / scale;
    //   universe.draw();
  }
}

BigBangElement.TAG_NAME = "big-bang-element";
BigBangElement.HTML = require("!raw-loader!./BigBangElement.html").default;
BigBangElement.CSS = require("!raw-loader!./BigBangElement.css").default;
BigBangElement.observedAttributes = ["active"];
