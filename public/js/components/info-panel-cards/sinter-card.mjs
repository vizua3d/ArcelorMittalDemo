/**
 */
export default class SinterCard extends HTMLElement {
    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
    }


    static get observedAttributes() {
        return ['unit', 'pricePerUnit'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        let { unit, pricePerUnit } = this.attributes;
        this.innerHTML = `
        <li class="flex items-center">
            <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="11" />
                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
            </svg>
            <p class="ml-4">
                Price per unit:
                <code class="text-sm font-bold text-gray-900">${parseFloat(pricePerUnit?.value).toFixed(2)} ${unit?.value}</code>
            </p>
        </li>`;
    }
}

customElements.define('am-sinter-card', SinterCard);