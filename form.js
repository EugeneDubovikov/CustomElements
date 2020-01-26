class CustomForm {
    constructor(form) {
        this.form = form;
        this.init();
    }

    init() {
        this.form.onsubmit = e => {
            e.preventDefault();
            return false;
        };

        this.form.onreset = ({target}) => {
            for (const i of target.getElementsByTagName('app-select, app-text-input')) {
                i.reset();
            }
        };
    }
}
