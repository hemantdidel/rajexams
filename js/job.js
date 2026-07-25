/* ==========================================
   RajExams Job Page Loader
========================================== */

async function loadJob() {

    try {

        // Current HTML File
        const page = window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");

        // JSON File
        const response = await fetch(`data/${page}.json`);

        if (!response.ok) {

            throw new Error("JSON file not found");

        }

        const job = await response.json();

        renderJob(job);

    }

    catch (error) {

        console.error(error);

    }

}

function renderJob(job){

    console.log(job);

}

document.addEventListener("DOMContentLoaded", () => {

    loadJob();

});
