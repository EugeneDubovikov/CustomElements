class CustomTextInput extends HTMLElement {
    constructor() {
        super();
        this.input = this.querySelector('input');
        this.placeholder = this.getAttribute('placeholder');
        this.disabled = this.hasAttribute('disabled');
        this.throttle = '';
        this.suggestList = null;
        if(this.input.hasAttribute('list')) {
            this.suggestList = this.querySelector('datalist');
        }
        let tmpl = document.createElement('template');
        let link = document.createElement('style');
        link.innerText = `
            :host {
              display: inline-block;
              position: relative;
            }
            :host .text__error {
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
              font: 12px/14px "Helios Normal", sans-serif;
            }
        `;
        tmpl.innerHTML = `
            <div class="text__error"></div>
            <slot></slot>
        `;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
        this.errorString = this.shadowRoot.querySelector('.text__error');
        this.init();
    }

    static get observedAttributes() {
        return ['placeholder', 'disabled'];
    }

    get name() {
        return this.input.name;
    }

    get value() {
        return this.input.value;
    }

    set value(val) {
        this.input.value = val;
    }

    init() {
        this.input.addEventListener('focus', this._onFocus.bind(this));
        this.input.addEventListener('blur', this.validateInput.bind(this));
        this.input.addEventListener('keyup', this._onKeyUp.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }

    _onFocus(e) {
        if (this.suggestList) {
            try {
                window.suggestRegionWorker.onmessage = this._onMessage.bind(this);
            } catch (e) {}
        }
    }

    _onKeyUp(e) {
        clearTimeout(this.throttle);
        this.throttle = setTimeout(this.validateInput.bind(this), 200, e);
    }

    _onMessage(message) {
        var option;
        this.suggestList.innerHTML = "";
        message.data.forEach(e => {
            option = document.createElement("option");
            option.setAttribute("value", e.CITY_NAME);
            this.suggestList.appendChild(option);
        });
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
        if (this.suggestList) {
            try {
                window.suggestRegionWorker.postMessage(e.target.value);
            } catch (e) {}
        }
    }

    reset() {
        this.input.value = '';
        this.classList.remove('valid', ['invalid']);
    }
}

customElements.define('custom-text-input', CustomTextInput);