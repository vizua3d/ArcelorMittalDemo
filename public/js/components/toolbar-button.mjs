/**
 * inspired from https://flowbite.com/docs/components/buttons/#default-button
 * attributes:
 *      - String title      The title of the button
 *      - String iconClass  the classes to set for the icon
 */
export default class ToolbarButton extends HTMLElement {
    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
    }


    static get observedAttributes() {
        return ['title', 'iconClass'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        const { title, iconClass } = this.attributes;
        this.innerHTML = `
        <button type="button" class="mr-3 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
          <i class="${iconClass.value}"></i>${title.value}
        </button>`;
    }
}

customElements.define('am-toolbar-button', ToolbarButton);