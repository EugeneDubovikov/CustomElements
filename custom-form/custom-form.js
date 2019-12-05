class CustomForm extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        let tmpl = document.createElement('template');
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/custom-form/custom-form.css';
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
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}
customElements.define('custom-form', CustomForm);