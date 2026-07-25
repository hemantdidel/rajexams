/* ==========================================
   RajExams Main App
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadBreakingNews();

    loadList("data/jobs.json", "latestJobsList");

    loadList("data/results.json", "latestResultsList");

    loadList("data/admit-cards.json", "latestAdmitList");

});

/* ==========================================
Breaking News
========================================== */

async function loadBreakingNews() {

    try {

        const response = await fetch("data/breaking-news.json");

        const news = await response.json();

        const marquee = document.getElementById("breakingNews");

        if (!marquee) return;

        marquee.innerHTML = news.map(item =>

            `<a href="${item.url}">
                ${item.title}
            </a>`

        ).join(" &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; ");

    }

    catch (error) {

        console.error(error);

    }

}

document.addEventListener("componentsLoaded", () => {

    loadBreakingNews();

});

document.addEventListener("DOMContentLoaded", () => {

    loadJobs();

});
