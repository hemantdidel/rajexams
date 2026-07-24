const components = {
    "header": "components/header.html",
    "breakingNews": "components/breaking-news.html",
    "quick-links": "components/homepage-links.html"
};

async function loadComponents() {

    for (const [id, file] of Object.entries(components)) {

        const element = document.getElementById(id);

        if (!element) continue;

        try {

            const res = await fetch(file);

            element.innerHTML = await res.text();

        } catch (err) {

            console.error(file, err);

        }
    }

}

document.addEventListener("DOMContentLoaded", loadComponents);
