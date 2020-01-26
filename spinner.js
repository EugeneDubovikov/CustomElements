class SpinnerInput extends HTMLElement {

    constructor() {
        super();
        let tmpl = document.createElement('template');
        let link = document.createElement('style');
        link.innerText = `
:host {
    display: inline-block;
}
table {
    color: #ACACAC;
    table-layout: fixed;
    border-collapse: collapse;
}
td {
    padding: 0;
}
::slotted(input) {
    display: inline-block;
    width: 30px;
    text-align: center;
    border: none;
    vertical-align: middle;
    height: 100%;
    padding: 0;
}
.minus, .plus {
    display: inline-block;
    position: relative;
    width: 0.8em;
    height: 0.8em;
    color: #525252;
    border: 1px solid gainsboro;
    vertical-align: middle;
    cursor: pointer;
    -webkit-transition: background-color 0.2s;
    transition: background-color 0.2s;
    text-align: center;
    font-size: 2em;
    line-height: 0.9em;
}

.minus:active, .plus:active {
    background-color: #adadad;
}
.minus.disabled, .plus.disabled {
    cursor: not-allowed;
}`;
        tmpl.innerHTML = `<table>
<tbody>
	<tr>
		<td>
			<span class="minus">-</span>
		</td>
		<td style="background-color: white">
			<slot></slot>
		</td>
		<td>
			<span class="plus">+</span>
		</td>
	</tr>
</tbody>
</table>`;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
        this.plus = this.shadowRoot.querySelector('.plus');
        this.minus = this.shadowRoot.querySelector('.minus');
    }

    connectedCallback() {
        this.input = this.querySelector('input');
        this.init();
    }

    init() {
        this.plus.onclick = this._onIncrement.bind(this);
        this.minus.onclick = this._onDecrement.bind(this);
        this.input.addEventListener('input', this._onInput.bind(this));
        //this.checkRange();
        return this;
    }

    _onInput({target}) {
        if (+target.value > +target.max) {
            target.value = target.max;
        } else if (+target.value < +target.min) {
            target.value = target.min;
        }
        //this.checkRange();
    }

    _onIncrement() {
        if (+this.input.value >= +this.input.max) return;
        this.input.stepUp();
        this.input.dispatchEvent(new Event("change", {bubbles: true}));
    }

    _onDecrement() {
        if (+this.input.value <= +this.input.min) return;
        this.input.stepDown();
        this.input.dispatchEvent(new Event("change", {bubbles: true}));
        //this.checkRange();
    }

    checkRange() {
        this.minus.classList.toggle("disabled", +this.input.value <= +this.input.min);
    }
}
