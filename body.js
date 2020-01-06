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

    init() {
        document.body.addEventListener("click", e => {
            const target = e.target.closest("app-select");
            this.querySelectorAll("app-select").forEach(s => {
               if (!Object.is(target, s)) {
                   s.close();
               }
            });
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}

if ('customElements' in window) {
    customElements.define('app-body', AppBody);
}
