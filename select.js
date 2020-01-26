class CustomSelect extends HTMLElement {
    constructor() {
        super();
        this.select = this.querySelector('select');
        this.placeholder = this.getAttribute('placeholder');
        this.disabled = this.hasAttribute('disabled');
        let tmpl = document.createElement('template');
        let link = document.createElement('style');
        link.innerText = `:host {
    display: inline-block;
    width: 100%;
    position: relative;
}
:host(.expanded) .select__selected:before {
    transform: rotate(45deg);
}
:host(.expanded) .select__list {
    height: initial;
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
.select__list {
    position: absolute;
    background-color: white;
    left: 0;
    transform: scaleY(0);
    transform-origin: center top;
    height: 0;
    z-index: 3;
    width: 100%;
    height: 0;
    max-height: 300px;
    overflow: hidden auto;
    transition: transform 0.2s;
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
::slotted(select) {
    display: none
}`;
        const listItems = [...this.select.options].map(o => `<div data-value="${o.value}">${o.innerText}</div>`);
        tmpl.innerHTML = `
<div class="select__selected">${this.placeholder}</div>
<div class="select__list">${listItems.join('')}</div>
<slot></slot>`;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
        this.selected = this.shadowRoot.querySelector(".select__selected");
        this.list = this.shadowRoot.querySelector(".select__list");
        this.init();
    }

    static get observedAttributes() {
        return ['disabled', 'placeholder'];
    }

    get name() {
        return this.select.name;
    }

    get value() {
        return this.select.value;
    }

    init() {
        this.list.addEventListener("click", this.onSelect.bind(this));
        this.selected.addEventListener("click", this.onActivate.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
    }

    onActivate(e) {
        if (this.disabled) {
            return;
        }
        this.classList.toggle('expanded');
    }

    onSelect(e) {
        this.selected.innerText = e.target.innerText.trim();
        this.close();
    }

    close() {
        this.classList.remove("expanded");
    }

    reset() {
        this.selected.innerText = this.placeholder;
    }
}

