import "./PageElementGlobal.css";
import { initInstance } from "../../utils/customElement";
import { changePage } from "../../utils/router";

export default class PageElement extends HTMLElement {
  constructor() {
    super();
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
}

function onClick(evt) {
  evt.preventDefault();
  changePage(this.href);
}

PageElement.TAG_NAME = "page-element";
PageElement.HTML = require("!raw-loader!./PageElement.html").default;
PageElement.CSS = require("!raw-loader!./PageElement.css").default;
