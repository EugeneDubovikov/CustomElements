class CustomSelect extends HTMLElement {
    constructor() {
        super();
        this.input = this.querySelector('input');
        this.placeholder = this.getAttribute('placeholder');
        this.disabled = this.hasAttribute('disabled');
        this.default = this.input.getAttribute('value');
        let tmpl = document.createElement('template');
        let link = document.createElement('style');
        link.innerText = `:host {
    position: relative;
}
:host(.expanded) .select__selected:before {
    transform: rotate(45deg);
}
:host(.expanded) .select__list {
    height: initial;
    -ms-transform: scaleY(1);
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
}
:host([disabled]) .select__selected {
    color: gainsboro;
    cursor: not-allowed;
    background-color: #f6fafd;
}
.select__selected {
    padding: 12px 30px 12px 12px;
    font-size: 12px;
    line-height: 14px;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    position: relative;
    background-color: white;
    white-space: nowrap;
    cursor: pointer;
}
.select__selected:before {
    position: absolute;
    content: "";
    border: 2px solid #B3B3B3;
    border-width: 2px 0 0 2px;
    width: 7px;
    height: 7px;
    right: 14px;
    transform: rotate(-135deg);
    top: calc(50% - 5px);
    transition: transform 0.2s;
}
.select__list_container {
    position: relative;
    width: 100%
}

.select__list {
    position: absolute;
    background-color: white;
    left: 0;
    -webkit-transform-origin: center top;
    transform-origin: center top;
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    height: 0;
    z-index: 3;
    width: 100%;
    max-height: 300px;
    overflow: hidden auto;
    transition: transform 0.2s, height 0.2s;
    box-shadow: 2px 2px 2px 1px #0000002b;
}
.select__list > * {
    padding: 10px;
    transition: background-color 0.2s;
    display: block;
    cursor: pointer;
}
.select__list > *:hover {
    background-color: rgba(169, 169, 169, 0.23);
}
::slotted(input) {
    display: none;
}`;
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
        this.selected.innerHTML = this.options.find(o => o.value == val).name;
        this.input.dispatchEvent(new Event("change", {bubbles: true, composed: true}));
    }

    init() {
        this.input.addEventListener("change", this.onChange.bind(this));
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
        this.values = this.options
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

    onChange(e) {
        this.selected.innerHTML = this.options.find(o => o.value == e.target.value).name;
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
        this.selected.innerText = this.placeholder;
    }
}

if (typeof(customElements) !== 'undefined') {
    customElements.define('custom-select', CustomSelect);
}