export function initClass(_class, elementName, templateHtml) {
  const template = document.createElement("template");
  template.innerHTML = templateHtml;
  window.customElements.define(elementName, _class);
  return template;
}

export function initInstance(scope, template) {
  scope.attachShadow({
    mode: "open"
  });
  scope.shadowRoot.appendChild(template.content.cloneNode(true));
}
