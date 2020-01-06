class CustomSelect extends HTMLElement {
    constructor() {
        super();
        this.placeholder = this.getAttribute('placeholder');
        this.disabled = this.hasAttribute('disabled');
        this._name = this.getAttribute('name');
        let tmpl = document.createElement('template');
        let link = document.createElement('style');
        link.innerText = `:host {
    display: inline-block;
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
label {
    padding: 10px;
    transition: background-color 0.2s;
    display: block;
    cursor: pointer;
}
label:hover {
    background-color: rgba(169, 169, 169, 0.23);
}`;
        const arOptions = JSON.parse(this.getAttribute("options"));
        const optionsNodes = arOptions.map(o => (`<label>
    <span>${o.text}</span>
    <input type="radio" name="${this._name}" value="${o.value}">
</label>`), this);
        tmpl.innerHTML = `
<div class="select__selected">${this.placeholder}</div>
<div class="select__list">${optionsNodes.join('')}</div>
`;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
        this.selected = this.shadowRoot.querySelector(".select__selected");
        this.list = this.shadowRoot.querySelector(".select__list");
        this.init();
    }

    static get observedAttributes() {
        return ['placeholder', 'disabled'];
    }

    get name() {
        return this.inputs.get(0).name;
    }

    get value() {
        return this.inputs.find(i => i.checked).value;
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
        this.selected.innerText = e.target.closest("label").innerText.trim();
        this.close();
    }

    close() {
        this.classList.remove("expanded");
    }

    reset() {
        this.selected.innerText = this.placeholder;
    }
}

if ('customElements' in window) {
    customElements.define('app-select', CustomSelect);
}
