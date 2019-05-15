import "./TreeBranchGlobal.css";
import { initInstance } from "utils/customElement";
import { changePage } from "utils/router";

export default class TreeBranch extends HTMLElement {
  constructor() {
    super();
    initInstance(this, TreeBranch.TEMPLATE);

    const containsContent = !!this.querySelector(":scope > [slot=content]");
    if (containsContent) {
      this.setAttribute("contains-content", "");
    }

    let numPages = 0;
    for (const child of this.children) {
      if (child.tagName.toLowerCase() === TreeBranch.TAG_NAME) {
        numPages++;
      }
    }
    this.shadowRoot
      .querySelector("[name=branches]")
      .style.setProperty("--siblings", numPages - 1);

    const anchorElement = this.shadowRoot.querySelector("a");
    anchorElement.addEventListener("click", onClick.bind(this));
    anchorElement.setAttribute("href", this.href);

    const textElement = this.shadowRoot.querySelector("type-setter");
    textElement.innerHTML = this.getAttribute("name");
  }
}

function onClick(evt) {
  evt.preventDefault();
  changePage(this.href);
}

TreeBranch.TAG_NAME = "tree-branch";
TreeBranch.HTML = require("!raw-loader!./TreeBranch.html").default;
TreeBranch.CSS = require("!raw-loader!./TreeBranch.css").default;
