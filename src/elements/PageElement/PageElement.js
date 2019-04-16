const template = document.createElement("template");
template.innerHTML = `
<style>
</style>
<slot name='title'></slot>
<slot name='pages'></slot>
<slot></slot>
`;

export default class PageElement extends HTMLElement {
  constructor() {
    super();
    console.log("PageElement.constructor");
    this.attachShadow({
      mode: "open"
    });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    console.log("PageElement.connectedCallback");
  }

  disconnectedCallback() {
    console.log("PageElement.disconnectedCallback");
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    console.log(
      "PageElement.attributeChangedCallback",
      attributeName,
      oldValue,
      newValue,
      namespace
    );
  }
}

window.customElements.define("page-element", PageElement);
