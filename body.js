class AppBody extends HTMLElement {
    constructor() {
        super();
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
