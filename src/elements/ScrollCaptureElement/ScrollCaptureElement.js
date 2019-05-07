import { initInstance } from "../../utils/customElement";

const EXCESS = 200;

// function convertMouseEventToTouch(mouseEvent) {
//   return new Touch({
//     identifier: 0,
//     target: mouseEvent.target,
//     clientX: mouseEvent.clientX,
//     clientY: mouseEvent.clientY,
//     screenX: mouseEvent.screenX,
//     screenY: mouseEvent.screenY,
//     pageX: mouseEvent.pageX,
//     pageY: mouseEvent.pageY
//     // radiusX: 11.5,
//     // radiusY: 11.5,
//     // rotationAngle: 0,
//     // force: 1
//   });
// }

// const EVENT_TYPE_MAP = {
//   mousedown: "touchstart",
//   mouseup: "touchend",
//   mousemove: "touchmove"
// };

// function convertMouseEventToTouchEvent(mouseEvent, touchArray) {
//   return new TouchEvent(EVENT_TYPE_MAP[mouseEvent.type], {
//     touches: [...touchArray],
//     targetTouches: [...touchArray],
//     changedTouches: [...touchArray],
//     ctrlKey: mouseEvent.ctrlKey,
//     shiftKey: mouseEvent.shiftKey,
//     altKey: mouseEvent.altKey,
//     metaKey: mouseEvent.metaKey,
//     bubbles: mouseEvent.bubbles,
//     cancelable: mouseEvent.cancelable,
//     composed: mouseEvent.composed
//   });
// }

export default class ScrollCaptureElement extends HTMLElement {
  constructor() {
    super();
    initInstance(this, ScrollCaptureElement.TEMPLATE);

    // this._onMouseDown = this._onMouseDown.bind(this);
    // this._onMouseUp = this._onMouseUp.bind(this);
    // this._onMouseMove = this._onMouseMove.bind(this);
    // this._onClick = this._onClick.bind(this);
    // this._onTouchStart = this._onTouchStart.bind(this);
    // this._onTouchEnd = this._onTouchEnd.bind(this);
    // this._onTouchMove = this._onTouchMove.bind(this);
    // this._onWheel = this._onWheel.bind(this);

    // this.addEventListener("mousedown", this._onMouseDown);
    // this.addEventListener("mouseup", this._onMouseUp);
    // this.addEventListener("mousemove", this._onMouseMove);
    // this.addEventListener("click", this._onClick);
    // this.addEventListener("touchstart", this._onTouchStart);
    // this.addEventListener("touchend", this._onTouchEnd);
    // this.addEventListener("touchmove", this._onTouchMove);
    // this.addEventListener("wheel", this._onWheel);

    this._onScroll = this._onScroll.bind(this);
    this.reset();
    this.addEventListener("scroll", this._onScroll);
  }

  // _onMouseDown(mouseEvent) {
  //   console.log("_onMouseDown", mouseEvent);

  // this._currentTouch = convertMouseEventToTouch(mouseEvent);
  // const touchEvent = convertMouseEventToTouchEvent(mouseEvent, [
  //   this._currentTouch
  // ]);
  // mouseEvent.stopImmediatePropagation();
  // mouseEvent.preventDefault();
  // this.dispatchEvent(touchEvent);
  // console.log("_onMouseDown", touchEvent);
  // }

  // _onMouseUp(mouseEvent) {
  //   console.log("_onMouseUp", mouseEvent);

  // const touchEvent = convertMouseEventToTouchEvent(mouseEvent, [
  //   this._currentTouch
  // ]);
  // mouseEvent.stopImmediatePropagation();
  // mouseEvent.preventDefault();
  // this.dispatchEvent(touchEvent);
  //
  // console.log("_onMouseUp", touchEvent);
  // this._currentTouch = null;
  // }

  // _onMouseMove(mouseEvent) {
  //   console.log("_onMouseMove", mouseEvent);

  // if (this._currentTouch) {
  //   const touchEvent = convertMouseEventToTouchEvent(mouseEvent, [
  //     this._currentTouch
  //   ]);
  //   mouseEvent.stopImmediatePropagation();
  //   mouseEvent.preventDefault();
  // this.dispatchEvent(touchEvent);
  //   console.log("_onMouseMove", touchEvent);
  // }

  // const wheelEvent = new WheelEvent("mousewheel", {
  //   deltaX: 0,
  //   deltaY: 10,
  //   deltaZ: 0,
  //   // deltaMode:0x00,
  //   composed: mouseEvent.composed,
  //   target: mouseEvent.target,
  //   clientX: mouseEvent.clientX,
  //   clientY: mouseEvent.clientY,
  //   screenX: mouseEvent.screenX,
  //   screenY: mouseEvent.screenY,
  //   pageX: mouseEvent.pageX,
  //   pageY: mouseEvent.pageY
  // });
  // this.dispatchEvent(wheelEvent);
  // }

  // _onClick(evt) {
  //   console.log("_onClick", evt);
  // }
  //
  // _onTouchStart(evt) {
  //   console.log("_onTouchStart", evt);
  // }
  //
  // _onTouchEnd(evt) {
  //   console.log("_onTouchEnd", evt);
  // }
  //
  // _onTouchMove(evt) {
  //   console.log("_onTouchMove", evt);
  // }
  //
  // _onWheel(evt) {
  //   console.log("_onWheel", evt);
  // }

  connectedCallback() {}

  disconnectedCallback() {}

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {}

  _onScroll(evt) {
    // console.log("ScrollCaptureElement._onScroll", evt);
    const { scrollTop, scrollLeft } = this;
    const topDiff = scrollTop - this._lastScrollTop;
    const leftDiff = scrollLeft - this._lastScrollLeft;
    this._x += leftDiff;
    this._y += topDiff;
    this._lastScrollTop = scrollTop;
    this._lastScrollLeft = scrollLeft;
    if (scrollTop > EXCESS * 2) {
      this.scrollTop = scrollTop - EXCESS;
      this._lastScrollTop -= EXCESS;
    } else if (scrollTop < EXCESS) {
      this.scrollTop = scrollTop + EXCESS;
      this._lastScrollTop += EXCESS;
    }
    if (scrollLeft > EXCESS * 2) {
      this.scrollLeft = scrollLeft - EXCESS;
      this._lastScrollLeft -= EXCESS;
    } else if (scrollLeft < EXCESS) {
      this.scrollLeft = scrollLeft + EXCESS;
      this._lastScrollLeft += EXCESS;
    }
  }

  reset() {
    this.scrollTop = EXCESS;
    this.scrollLeft = EXCESS;
    this._lastScrollTop = EXCESS;
    this._lastScrollLeft = EXCESS;
    this._x = 0;
    this._y = 0;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }
}

ScrollCaptureElement.TAG_NAME = "scroll-capture-element";
ScrollCaptureElement.HTML = require("!raw-loader!./ScrollCaptureElement.html").default;
ScrollCaptureElement.CSS = require("!raw-loader!./ScrollCaptureElement.css").default;
