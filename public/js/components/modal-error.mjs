import { createElementFromHTML } from '../utils.mjs';
/**
 * inspired from https://flowbite.com/docs/components/modal/#default-modal
 * attributes:
 *      - String title      The title of the button
 */
export default class ModalError extends HTMLElement {
    #modalBody
    #paragraphs
    #toggle
    #crossButton
    #okButton

    constructor() {
        super();
        this.#paragraphs = [];
        this.#modalBody = createElementFromHTML('<div class="p-4 md:p-5 space-y-4"/>');
        this.#toggle = createElementFromHTML(`<button data-modal-target="${this.id}" data-modal-toggle="${this.id}" class="hidden block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button"></button>`);

        this.setAttribute('tab-index', -1);
        this.setAttribute('aria-hidden', true);
        const classes = 'hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'
        this.classList.add(...classes.split(' '));

        document.body.append(this.#toggle);

        this.#crossButton = createElementFromHTML(`
        <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
        </button>`);
        this.#crossButton.addEventListener('click', this.hide);

        this.#okButton = createElementFromHTML(`
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            OK
        </button>`);
        this.#okButton.addEventListener('click', this.hide);
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
    }

    // This function can be accessed in element query to set internal data externally
    setParagraphs(paragraphs) {
        this.#paragraphs = paragraphs;
        this.render();
    }

    clear() {
        for (const child of this.#modalBody.children) {
            child.remove();
        }
    }

    show = (paragraphs) => {
        if(paragraphs) {
            this.setParagraphs(paragraphs);
        }

        const classes = [...this.classList.values()];
        if(classes.includes('hidden')) {
            this.#toggle.click();
        }
    }

    hide = () => {
        const classes = [...this.classList.values()];
        if(!classes.includes('hidden')) {
            this.#toggle.click();
        }
    }

    static get observedAttributes() {
        return ['title'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        this.clear();

        const { title } = this.attributes;
        const paragraphs = this.#paragraphs.map(paragraph => {
            return createElementFromHTML(`<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">${paragraph}</p>`);
        });
        paragraphs.forEach(element => this.#modalBody.append(element));

        const dummyBody = document.createElement('div');
        dummyBody.append(this.#modalBody);

        this.innerHTML = `
        <div class="relative p-4 w-full max-w-2xl max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <!-- Modal header -->
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        ${title.value}
                    </h3>

                </div>
                <!-- Modal body -->
                ${dummyBody.innerHTML}
                <!-- Modal footer -->
                <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">

                </div>
            </div>
        </div>`;

        this.children[0].children[0].children[0].append(this.#crossButton);
        this.children[0].children[0].children[2].append(this.#okButton);
    }
}

customElements.define('am-modal-error', ModalError);