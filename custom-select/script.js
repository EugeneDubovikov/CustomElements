class CustomSelect extends HTMLElement {
    constructor() {
        super();
        this.input = this.querySelector('input');
        this.placeholder = this.getAttribute('placeholder');
        this.disabled = this.hasAttribute('disabled');
        let tmpl = document.createElement('template');
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/custom-select/style.css';
        tmpl.innerHTML = `
            <div class="select__selected"></div>
            <div class="select__list_container">
                <div class="select__list"></div>
            </div>
            <slot></slot>
        `;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
        this.selected = this.shadowRoot.querySelector(".select__selected");
        this.selected.innerText = this.placeholder;
        this.list = this.shadowRoot.querySelector(".select__list");
        this.init();
    }

    static get observedAttributes() {
        return ['placeholder', 'disabled', 'options'];
    }

    get name() {
        return this.input.name;
    }

    get value() {
        return this.input.value;
    }

    set value(val) {
        this.input.value = val;
        this.input.dispatchEvent(new Event("change", {bubbles: true, composed: true}));
    }

    init() {
        this.selected.addEventListener("click", this.onActivate.bind(this));
        this.list.addEventListener("click", this.onSelect.bind(this));
        this.refresh();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
        this.refresh();
    }

    refresh() {
        this.options = JSON.parse(this.getAttribute('options'));
        this.list.innerHTML = '';
        this.options.forEach(o => {
            let item = document.createElement("div");
            item.dataset.value = o.value;
            item.innerText = o.name;
            this.list.appendChild(item);
        });
    }

    onActivate(e) {
        if (this.disabled) {
            return;
        }
        this.classList.toggle('expanded');
    }

    onSelect(e) {
        let target = e.target.closest('[data-value]');
        if (target) {
            this.selected.innerText = target.innerText;
            this.value = target.dataset.value;
        }
        this.close();
    }

    close() {
        this.classList.remove("expanded");
    }

    reset() {
        this.value = target.dataset.value;
        this.selected.innerText = this.placeholder;
    }
}

if (window.supportsShadowDOMV1) {
    customElements.define('custom-select', CustomSelect);
}