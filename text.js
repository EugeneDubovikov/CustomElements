class TextInput extends HTMLElement {
    constructor() {
        super();
        this.disabled = this.hasAttribute('disabled');
        let tmpl = document.createElement('template');
        let link = document.createElement('style');
        link.innerText = `
:host {
    display: inline-block;
    width: 100%;
    position: relative;
}
.text__error {
    position: absolute;
    opacity: 0;
    left: 0;
    top: 100%;
    width: 100%;
    font: 10px/1 "Open Sans", sans-serif;
    color: red;
    -webkit-transition: opacity 0.5s;
    transition: opacity 0.5s;
    z-index: 2;
}
:host(.invalid) .text__error {
    opacity: 1;
}
::slotted(input) {
    display: inline-block;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 12px;
}`;
        tmpl.innerHTML = `
<div class="text__error"></div>
<slot></slot>`;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
        this.errorString = this.shadowRoot.querySelector('.text__error');
    }

    static get observedAttributes() {
        return ['disabled'];
    }

    set value(val) {
        this.input.value = val;
    }

    connectedCallback() {
        this.input = this.querySelector('input');
        this.init();
    }

    init() {
        this.input.addEventListener('blur', this.validateInput.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }

    validateInput(e) {
        var error, isInvalid;
        error = '';
        isInvalid = false;
        if (!this.input.checkValidity()) {
            error = this.input.validationMessage;
            isInvalid = true;
        }
        this.classList.toggle('invalid', isInvalid);
        this.classList.toggle('valid', !isInvalid);
        this.errorString.innerText = error;
        this.input.dispatchEvent(new Event('change', {bubbles: true}));
    }

    reset() {
        this.classList.remove('valid', 'invalid');
    }
}
