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

    const container = document.getElementById("breakingNews");

    if (!container) return;

    try {

        const response = await fetch("data/breaking-news.json");

        if (!response.ok) {
            throw new Error("breaking-news.json not found");
        }

        const news = await response.json();

        container.innerHTML = news.map(item => {

            return `
                <a href="${item.url}">
                    ${item.title}
                </a>
            `;

        }).join(" &nbsp;&nbsp; | &nbsp;&nbsp; ");

    }

    catch (error) {

        console.error("Breaking News Error:", error);

        container.innerHTML = "";

    }

}
