
class LocationSelector extends HTMLElement {
    constructor() {
        super();
        this.ajaxUrl = "/bitrix/components/bitrix/sale.location.selector.search/get.php";
        this.throttle = '';
        let tmpl = document.createElement('template');
        let link = document.createElement('style');
        link.innerText = `
:host {
    display: inline-block;
    width: 100%;
    position: relative;
}
.datalist {
    position: absolute;
    background-color: white;
    width: 100%;
    left: 0;
    top: 100%;
    z-index: 1;
    box-shadow: 0px 8px 8px 1px #a5a5a5;
    padding: 0 10px;
    box-sizing: border-box;
}
.datalist > * {
    margin: 6px 0;
    cursor: pointer;
}
.selected-value {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    background-color: white;
    padding: 9px;
    border: 1px solid #e5e5e5;
    box-sizing: border-box;
}
::slotted(input) {
    display: inline-block;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 12px;
}`;
        tmpl.innerHTML = `
<slot></slot>
<div class="selected-value">Город</div>
<div class="datalist" style="display: none"></div>`;
        let shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(tmpl.content.cloneNode(true));
        shadowRoot.appendChild(link);
        this.list = this.shadowRoot.querySelector('.datalist');
        this.selectedValue = this.shadowRoot.querySelector('.selected-value');
    }

    connectedCallback() {
        this.input = this.querySelector('input');
        this.siteId = this.getAttribute("siteId") | "s1";
        this.init();
    }

    init() {
        this.input.oninput = function ({target: {value}}) {
            if (value.length < 3) return;
            clearTimeout(this.throttle);
            this.throttle = setTimeout(this._onInput.bind(this, value), 200);
        }.bind(this);
        this.selectedValue.onclick = function () {
            this.selectedValue.style.display = "none";
            this.input.value = this.selectedValue.innerText;
            this.input.focus();
        }.bind(this);
        this.list.onclick = function ({target, target: {dataset: {value}}}) {
            this.selectedValue.innerText = target.innerText.trim();
            this.selectedValue.removeAttribute("style");
            this.list.style.display = "none";
            this.input.value = value;
        }.bind(this);

        BX.ajax({
            url: this.ajaxUrl,
            method: "POST",
            dataType: 'json',
            data: {
                "select[1]": "CODE",
                "select[2]": "TYPE_ID",
                "select[VALUE]": "ID",
                "select[DISPLAY]": "NAME.NAME",
                "additionals[1]": "PATH",
                "filter[=CODE]": this.input.value,
                "filter[=NAME.LANGUAGE_ID]": "ru",
                "filter[=SITE_ID]": this.siteId,
                "version": "2",
                "PAGE_SIZE": "10",
                "PAGE": "0"
            },
            onsuccess: function ({data: {ITEMS}}) {
                if (ITEMS.length) this.selectedValue.innerText = ITEMS[0].DISPLAY;
            }.bind(this),
            onfailure: message => console.log(message)
        });
    }

    _onInput(value) {
        document.body.dispatchEvent(new CustomEvent("AjaxStart"));
        BX.ajax({
            url: this.ajaxUrl,
            method: "POST",
            dataType: 'json',
            data: {
                "select[1]": "CODE",
                "select[2]": "TYPE_ID",
                "select[VALUE]": "ID",
                "select[DISPLAY]": "NAME.NAME",
                "additionals[1]": "PATH",
                "filter[=PHRASE]": value,
                "filter[=NAME.LANGUAGE_ID]": "ru",
                "filter[=SITE_ID]": this.siteId,
                "version": "2",
                "PAGE_SIZE": "10",
                "PAGE": "0"
            },
            onsuccess: function ({data: {ITEMS}}) {
                this.list.style.display = "none";
                if (ITEMS.length) {
                    let str = '';
                    for (const {DISPLAY, CODE} of ITEMS) {
                        str += `<div data-value="${CODE}">${DISPLAY}</div>`;
                    }
                    this.list.innerHTML = str;
                    this.list.removeAttribute("style");
                }
            }.bind(this),
            onfailure: message => console.log(message)
        });
    }
}
