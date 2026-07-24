/* ==========================================================
   RajExams Component Loader
========================================================== */

const components = {

    header: "components/header.html",

    "breaking-news": "components/breaking-news.html",

    "homepage-links": "components/homepage-links.html",

    "home-main-updates": "components/home-main-updates.html",

    "home-extra-updates": "components/home-extra-updates.html",

    footer: "components/footer.html"

};

/* ==========================================
Load Single Component
========================================== */

async function loadComponent(id, file) {

    const element = document.getElementById(id);

    if (!element) return;

    try {

        const response = await fetch(file);

        if (!response.ok) {

            throw new Error(`${file} not found`);

        }

        element.innerHTML = await response.text();

    }

    catch (error) {

        console.error(error);

        element.innerHTML = `
            <div style="
                padding:20px;
                color:red;
                font-weight:bold;
            ">
                Failed to load ${file}
            </div>
        `;

    }

}

/* ==========================================
Load All Components
========================================== */

async function loadComponents() {

    const tasks = [];

    for (const [id, file] of Object.entries(components)) {

        tasks.push(

            loadComponent(id, file)

        );

    }

    await Promise.all(tasks);

    document.dispatchEvent(

        new CustomEvent("componentsLoaded")

    );

}

/* ==========================================
Start
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    loadComponents

);
