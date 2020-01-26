document.body.addEventListener("click", ({target}) => {
    const selectElement = target.closest("app-select");
    for (const s of document.getElementsByTagName("app-select")) {
       if (!Object.is(selectElement, s)) {
           s.close();
       }
    }
});

if ('customElements' in window) {
    customElements.define('app-select', CustomSelect);
    customElements.define('app-text-input', TextInput);
}

new CustomForm(document.forms.customForm);
