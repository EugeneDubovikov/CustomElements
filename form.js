class CustomForm extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        this.init();
    }

    static get observedAttributes() {
        return ['method', 'action'];
    }

    init() {
        this.form.addEventListener("submit", function (e) {
            e.preventDefault();
            console.log(e.target.elements['foo'].value);
            return false;
        });
        this.form.addEventListener("reset", function (e) {
            e.target.querySelectorAll('app-select, app-text-input').forEach(i => i.reset());
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }
}
if ('customElements' in window) {
    customElements.define('app-form', CustomForm);
}
