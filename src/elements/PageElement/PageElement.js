import "./PageElementGlobal.css";
import { initInstance } from "../../utils/customElement";

export default class PageElement extends HTMLElement {
  // _selectedPage = null;

  constructor() {
    console.log("PageElement.constructor");
    super();
    initInstance(this, PageElement.TEMPLATE);
    this._onClick = onClick.bind(this);
    this._onClickReceived = onClickReceived.bind(this);

    const pages = [];

    for (const child of this.children) {
      if (child.tagName.toLowerCase() === PageElement.TAG_NAME.toLowerCase()) {
        pages.push(child);
      }
    }
    this.shadowRoot
      .getElementById("pages")
      .style.setProperty("--siblings", pages.length - 1);

    this.shadowRoot
      .querySelector("button")
      .addEventListener("click", this._onClick);
    this.addEventListener(_CLICK_EVENT, this._onClickReceived);
  }

  connectedCallback() {
    // console.log("PageElement.connectedCallback");
  }

  disconnectedCallback() {
    // console.log("PageElement.disconnectedCallback");
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    // console.log(
    //   "PageElement.attributeChangedCallback",
    //   attributeName,
    //   oldValue,
    //   newValue,
    //   namespace
    // );
  }
}

function onClick(evt) {
  this.dispatchEvent(
    new Event(_CLICK_EVENT, {
      bubbles: true,
      cancelable: true,
      composed: false
    })
  );
  this.setAttribute("selected", "");
}

function onClickReceived(evt) {
  console.log(this.getAttribute("id"), this.getAttribute("selected"));
  if (evt.target !== this) {
    if (this.getAttribute("selected") !== null) {
      evt.stopPropagation();
    } else {
      this.setAttribute("selected", "");
    }
    if (this._selectedPage) {
      this._selectedPage.removeAttribute("selected");
    }
    this._selectedPage = evt.target;
  }
}

PageElement.TAG_NAME = "page-element";
PageElement.HTML = require("!raw-loader!./PageElement.html").default;
PageElement.CSS = require("!raw-loader!./PageElement.css").default;
const _CLICK_EVENT = "PageElement.CLICK_EVENT";
