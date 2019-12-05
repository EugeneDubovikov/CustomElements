class AppBody extends HTMLElement {
    constructor() {
        super();
        let tmpl = document.createElement('template');
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/app-body/style.css';
        tmpl.innerHTML = `
            <slot></slot>
        `;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
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

window.supportsShadowDOMV1 = !!HTMLElement.prototype.attachShadow;

if (supportsShadowDOMV1) {
    customElements.define('app-body', AppBody);
}