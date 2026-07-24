async function loadList(jsonFile, elementId) {

    try {

        const response = await fetch(jsonFile);

        const data = await response.json();

        const container = document.getElementById(elementId);

        if (!container) return;

        container.innerHTML = "";

        data.forEach(item => {

            container.innerHTML += `

            <li>

                <a href="${item.url}">

                    ➜ ${item.title}

                    ${item.new ? '<span class="new-tag">NEW</span>' : ''}

                </a>

            </li>

            `;

        });

    }

    catch (e) {

        console.error(e);

    }

}
