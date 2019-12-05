class CustomForm extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        let tmpl = document.createElement('template');
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/custom-form/style.css';
        tmpl.innerHTML = `
            <slot></slot>`;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
        this.init();
    }

    static get observedAttributes() {
        return ['method', 'action'];
    }

    init() {
        this.form.addEventListener("submit", function (e) {
            e.preventDefault();
            console.log(e.target.elements['foo']);
            return false;
        });
        this.form.addEventListener("reset", function (e) {
            e.target.querySelectorAll('custom-select, custom-text').forEach(i => i.reset());
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}
if (window.supportsShadowDOMV1) {
    customElements.define('custom-form', CustomForm);
}