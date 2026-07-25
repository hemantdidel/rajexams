console.log("job.js Loaded");

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
        const response = await fetch(`data/jobs/${slug}.json`);

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

    document.title = job.title;

    document.getElementById("breadcrumbTitle").textContent = job.title;

    document.getElementById("jobTitle").textContent = job.title;

    document.getElementById("jobBadge").textContent = job.badge;

    document.getElementById("jobDescription").textContent = job.description;

    document.getElementById("shortInformation").textContent = job.shortInformation;

}

const dates = document.getElementById("importantDates");

dates.innerHTML = "";

for (const [key, value] of Object.entries(job.importantDates)) {

    let title = key;

    switch (key) {

        case "applicationBegin":
            title = "Application Begin";
            break;

        case "lastDate":
            title = "Last Date";
            break;

        case "feePayment":
            title = "Fee Payment Last Date";
            break;

        case "correctionDate":
            title = "Correction Date";
            break;

        case "examDate":
            title = "Exam Date";
            break;

        case "admitCard":
            title = "Admit Card";
            break;

    }

    dates.innerHTML += `

        <tr>

            <td>${title}</td>

            <td>${value}</td>

        </tr>

    `;

}

document.addEventListener("DOMContentLoaded", () => {

    loadJob();

});
