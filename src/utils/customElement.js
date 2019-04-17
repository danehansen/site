export function initClass(customClass) {
  customClass.TEMPLATE = document.createElement("template");
  customClass.TEMPLATE.innerHTML = `<style>${customClass.CSS ||
    ""}</style>${customClass.HTML || ""}`;
  window.customElements.define(customClass.TAG_NAME, customClass);
}

export function initInstance(scope, template) {
  scope.attachShadow({
    mode: "open"
  });
  scope.shadowRoot.appendChild(template.content.cloneNode(true));
}
