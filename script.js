customElements.define('app-select', class extends HTMLElement {
    constructor() {
        super();
        var shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
            <style>
                select: {
                    font-size: 1.5em;
                }
            </style>
            <slot></slot>
        `;
    }
}, {extends: 'select'});

if (false && 'serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}