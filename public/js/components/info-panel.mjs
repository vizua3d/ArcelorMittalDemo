import { createElementFromHTML } from '../utils.mjs';
import './info-panel-cards/cokerie-card.mjs';
import './info-panel-cards/sinter-card.mjs';
import './info-panel-cards/utility-card.mjs';

/**
 * inspired from https://play.tailwindcss.com/
 * attributes:
 *      - String title      The title of the info panel
 *      - String itemType   The type of the items to display
 */
export default class InfoPanel extends HTMLElement {
    #itemList;
    #items;
    #itemRenderCompnentByType;

    constructor() {
        super();
        this.#items = [];
        this.#itemList = createElementFromHTML('<ul class="space-y-4"/>');
        this.#itemRenderCompnentByType = {
            cokerieCard: ({name, price, priceUnit}) => `<am-cokerie-card name="${name}" price="${price}" priceUnit="${priceUnit}" />`,
            utilityCard: ({name, price, priceunit}) => `<am-utility-card name="${name}" price="${price}" priceUnit="${priceunit}" />`,
            sinterCard: ({priceperunit, unit}) => `<am-sinter-card pricePerUnit="${priceperunit}" unit="${unit}" />`
        };

        const classes = "hidden info-panel absolute right-3 top-3 flex flex-col justify-center overflow-hidden";
        this.classList.add(...classes.split(' '));
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
    }

    // This function can be accessed in element query to set internal data externally
    setItems(items) {
        this.#items = items;
        this.render();
    }

    clear() {
        for (const child of this.#itemList.children) {
            child.remove();
        }
    }

    show = () => {
        this.classList.remove('hidden');
    }

    hide = () => {
        this.classList.add('hidden');
    }

    static get observedAttributes() {
        return ['title', 'itemType'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        this.clear();

        const { itemType, title } = this.attributes;
        const getItemHTML = this.#itemRenderCompnentByType[itemType.value];
        const itemElements = this.#items.map(item => {
            const itemHTML = getItemHTML(item);
            return createElementFromHTML(itemHTML);
        });
        itemElements.forEach(element => this.#itemList.append(element));

        this.innerHTML = `
        <div class="relative bg-white px-8 pt-0 pb-5 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-5">
            <div class="mx-auto max-w-md flex flex-col">
                <img src="./img/logo.png" class="h-32 self-center" alt="Logo Arcelor" />
                <div class="divide-y divide-gray-300/50">
                    <div class="py-8 text-base font-semibold leading-7">
                        <p class="text-gray-900">${title.value}:</p>
                    </div>
                </div>
            </div>
        </div>`;

        this.children[0].children[0].append(this.#itemList);
    }
}

customElements.define('am-info-panel', InfoPanel);