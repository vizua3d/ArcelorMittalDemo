window.HTMLTemplates = {
    renderCokerieCard: function(data) {

        return `
            <li class="flex items-center">
                <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="11" />
                    <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                </svg>
                <p class="ml-4">
                    ${data.name}:
                    <code class="text-sm font-bold text-gray-900">Price = ${data.price.toFixed(2)} ${data.priceUnit}</code>
                </p>
            </li>`;
    },
    renderSinterCard: function(data) {

        return `
            <li class="flex items-center">
                <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="11" />
                    <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                </svg>
                <p class="ml-4">
                    Price per unit:
                    <code class="text-sm font-bold text-gray-900">${data.priceperunit.toFixed(2)} ${data.unit}</code>
                </p>
            </li>`;
    },
    renderUtilityCard: function(data) {

        return `
            <li class="flex items-center">
                <svg class="h-6 w-6 flex-none fill-sky-100 stroke-sky-500 stroke-2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="11" />
                    <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none" />
                </svg>
                <p class="ml-4">
                    ${data.name}:
                    <code class="text-sm font-bold text-gray-900">Price = ${data.price.toFixed(2)} ${data.priceunit}</code>
                </p>
            </li>`;
    }
}