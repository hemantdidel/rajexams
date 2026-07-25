/* ==========================================================
Generic List Loader
========================================================== */

async function loadList(jsonFile, containerId, limit = null) {

    try {

        const response = await fetch(jsonFile);

        if (!response.ok) {
            throw new Error("Unable to load " + jsonFile);
        }

        let data = await response.json();

        if (limit) {
            data = data.slice(0, limit);
        }

        const container = document.getElementById(containerId);

        if (!container) return;

        container.innerHTML = "";

        data.forEach(item => {

            container.innerHTML += `

            <li>

                <a href="${item.slug}.html">

                    <span>➜ ${item.title}</span>

                    ${
                        item.new
                        ? '<span class="new-tag">NEW</span>'
                        : ""
                    }

                </a>

            </li>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}
