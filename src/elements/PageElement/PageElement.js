import "./PageElementGlobal.css";
import { initInstance } from "../../utils/customElement";
import { changePage } from "../../utils/router";

export default class PageElement extends HTMLElement {
  constructor() {
    super();
    // console.log("PageElement.constructor", this.href);
    initInstance(this, PageElement.TEMPLATE);

    const pages = [];

    for (const child of this.children) {
      if (child.tagName.toLowerCase() === PageElement.TAG_NAME.toLowerCase()) {
        pages.push(child);
      }
    }
    this.shadowRoot
      .getElementById("pages")
      .style.setProperty("--siblings", pages.length - 1);

    const anchorElement = this.shadowRoot.querySelector("a");
    anchorElement.addEventListener("click", onClick.bind(this));
    anchorElement.setAttribute("href", this.href);

    const textElement = this.shadowRoot.querySelector("text-element");
    textElement.innerHTML = this.getAttribute("name");
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
  evt.preventDefault();
  changePage(this.href);
}

PageElement.TAG_NAME = "page-element";
PageElement.HTML = require("!raw-loader!./PageElement.html").default;
PageElement.CSS = require("!raw-loader!./PageElement.css").default;
