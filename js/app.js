/* ==========================================================
   RajExams Main App
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* Breaking News */
    loadBreakingNews();

    /* Homepage Latest Jobs */
    if (document.getElementById("latestJobsList")) {
        loadList(
            "data/jobs-list.json",
            "latestJobsList",
            10
        );
    }

    /* Homepage Latest Results */
    if (document.getElementById("latestResultsList")) {
        loadList(
            "data/results.json",
            "latestResultsList",
            10
        );
    }

    /* Homepage Latest Admit Cards */
    if (document.getElementById("latestAdmitList")) {
        loadList(
            "data/admit-cards.json",
            "latestAdmitList",
            10
        );
    }

    /* Jobs Page */
    if (document.getElementById("jobsList")) {
        loadList(
            "data/jobs.json",
            "jobsList"
        );
    }

    /* Results Page */
    if (document.getElementById("resultsList")) {
        loadList(
            "data/results.json",
            "resultsList"
        );
    }

    /* Admit Cards Page */
    if (document.getElementById("admitCardsList")) {
        loadList(
            "data/admit-cards.json",
            "admitCardsList"
        );
    }

   /* Answer Key Page */

if (document.getElementById("answerKeyList")) {

    loadList(
        "data/answer-key.json",
        "answerKeyList"
    );

}
   /* Admissions Page */

if (document.getElementById("admissionsList")) {

    loadList(
        "data/admissions.json",
        "admissionsList"
    );

}
   /* Syllabus Page */

if (document.getElementById("syllabusList")) {

    loadList(
        "data/syllabus.json",
        "syllabusList"
    );

}
   /* Current Affairs Page */

if (document.getElementById("currentAffairsList")) {

    loadList(
        "data/current-affairs.json",
        "currentAffairsList"
    );

}
   /* Notes Page */

if (document.getElementById("notesList")) {

    loadList(
        "data/notes.json",
        "notesList"
    );

}

});


/* ==========================================================
   Breaking News
========================================================== */

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

        console.error("Breaking News Error:", error);

    }

}


/* ==========================================================
   Components Loaded
========================================================== */

document.addEventListener("componentsLoaded", () => {

    loadBreakingNews();

});
