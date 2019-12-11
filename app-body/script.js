class AppBody extends HTMLElement {
    constructor() {
        super();
        let tmpl = document.createElement('template');
        tmpl.innerHTML = `
            <slot></slot>
        `;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        this.init();
    }

    static get observedAttributes() {
        return ['placeholder', 'disabled', 'options'];
    }

    init() {}

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}

if (typeof(customElements) !== 'undefined') {
    customElements.define('app-body', AppBody);
}