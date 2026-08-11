// Just enough DOM for lit to evaluate and for the card class to register.
//
// The tests never mount the card: they call render() and inspect the values it
// computed, so no node is ever created. Importing the built bundle only needs
// the handful of globals lit touches while loading.

globalThis.window = globalThis;

// The editor reports every change by dispatching a `config-changed` event, so
// unlike the card it needs these two. dispatchEvent does nothing by default -
// a test that cares replaces it to capture what was emitted.
globalThis.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
        this.bubbles = !!init.bubbles;
        this.composed = !!init.composed;
    }
};
globalThis.HTMLElement = class {
    attachShadow() { return {}; }
    dispatchEvent() { return true; }
};
globalThis.customElements = {
    __registry: {},
    define(name, cls) { this.__registry[name] = cls; },
    get(name) { return this.__registry[name]; },
};

class Document {}
Document.prototype.adoptedStyleSheets = [];
globalThis.Document = Document;
globalThis.CSSStyleSheet = class { replace() {} replaceSync() {} };
globalThis.ShadowRoot = class {};
globalThis.document = Object.assign(new Document(), {
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, textContent: '' }),
    createTextNode: () => ({}),
    createComment: () => ({}),
    createTreeWalker: () => ({ nextNode: () => null, currentNode: null }),
    createDocumentFragment: () => ({ appendChild() {} }),
    head: { appendChild() {} },
});
