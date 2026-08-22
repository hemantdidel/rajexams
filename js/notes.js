/* ==========================================================
   RajExams — Study Notes
   8 Main Categories
   Category → Subject → Notes
   Search + Accordion + Hover Animation
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const navigation = document.getElementById("notesNavigation");
    const searchInput = document.getElementById("notesSearch");

    const frame = document.getElementById("notesFrame");
    const welcome = document.getElementById("notesWelcome");

    const breadcrumb =
        document.getElementById("notesBreadcrumb");

    const sidebar =
        document.querySelector(".notes-sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const fullscreenButton =
        document.getElementById("notesFullscreen");


    if (!navigation) return;


    /* ======================================================
       8 MAIN CATEGORIES
    ====================================================== */

    const MAIN_CATEGORIES = [

        {
            name: "Rajasthan GK",
            icon: "🏜️"
        },

        {
            name: "India GK",
            icon: "🇮🇳"
        },

        {
            name: "Science",
            icon: "🔬"
        },

        {
            name: "Computer",
            icon: "💻"
        },

        {
            name: "Mathematics",
            icon: "🧮"
        },

        {
            name: "Reasoning",
            icon: "🧠"
        },

        {
            name: "Hindi",
            icon: "🔤"
        },

        {
            name: "English",
            icon: "📖"
        }

    ];


    /* ======================================================
       LOAD NOTES JSON
    ====================================================== */

    fetch("data/notes.json")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Unable to load notes.json"
                );
            }

            return response.json();

        })

        .then(notes => {

            if (!Array.isArray(notes)) {
                throw new Error(
                    "notes.json must contain an array"
                );
            }

            buildNavigation(notes);
            setupSearch(notes);

        })

        .catch(error => {

            console.error(
                "Notes Loading Error:",
                error
            );

            navigation.innerHTML = `
                <div class="notes-empty-search">
                    Notes load नहीं हो सके।
                </div>
            `;

        });


    /* ======================================================
       BUILD NAVIGATION
    ====================================================== */

    function buildNavigation(notes) {

        navigation.innerHTML = "";


        /*
         Create fixed structure

         Rajasthan GK
            └── Subjects
                  └── Notes

         India GK
            └── Subjects

         Science
            └── Subjects

         etc.
        */


        const grouped = {};


        MAIN_CATEGORIES.forEach(category => {

            grouped[category.name] = {};

        });


        /* ==================================================
           GROUP NOTES
        ================================================== */

        notes.forEach(note => {

            const category =
                normalizeCategory(
                    note.category
                );

            const subject =
                note.subject || "General";


            /*
             Ignore unknown category
             */

            if (!grouped[category]) {
                return;
            }


            if (!grouped[category][subject]) {

                grouped[category][subject] = [];

            }


            grouped[category][subject].push(note);

        });


        /* ==================================================
           CREATE 8 CATEGORY BOXES
        ================================================== */

        MAIN_CATEGORIES.forEach(
            (categoryData, categoryIndex) => {


                const categoryName =
                    categoryData.name;


                const categoryBox =
                    document.createElement("div");


                categoryBox.className =
                    "notes-category";


                categoryBox.dataset.category =
                    categoryName.toLowerCase();


                categoryBox.style.setProperty(
                    "--category-index",
                    categoryIndex
                );


                /* =================================================
                   CATEGORY BUTTON
                ================================================= */

                const categoryButton =
                    document.createElement("button");


                categoryButton.type =
                    "button";


                categoryButton.className =
                    "notes-category-button";


                const subjectData =
                    grouped[categoryName];


                const subjectNames =
                    Object.keys(subjectData);


                const totalNotes =
                    subjectNames.reduce(
                        (total, subject) => {

                            return total +
                                subjectData[subject].length;

                        },
                        0
                    );


                categoryButton.innerHTML = `

    <span class="category-left">

        <span class="category-icon">
            ${categoryData.icon}
        </span>

        <span class="category-title">
            ${escapeHTML(categoryName)}
        </span>

    </span>

    <span class="category-right">

        <span class="category-count">
            ${totalNotes}
        </span>

        <span class="category-arrow">
            ▾
        </span>

    </span>

`;


                /* =================================================
                   SUBJECTS WRAPPER
                ================================================= */

                const subjects =
                    document.createElement("div");


                subjects.className =
                    "notes-subjects";


                const subjectsInner =
                    document.createElement("div");


                subjectsInner.className =
                    "notes-subjects-inner";


                /* =================================================
                   CREATE SUBJECTS
                ================================================= */

                subjectNames.forEach(
                    subjectName => {


                        const subjectBox =
                            document.createElement("div");


                        subjectBox.className =
                            "notes-subject";


                        subjectBox.dataset.subject =
                            subjectName.toLowerCase();


                        /* SUBJECT BUTTON */

                        const subjectButton =
                            document.createElement("button");


                        subjectButton.type =
                            "button";


                        subjectButton.className =
                            "notes-subject-button";


                        const subjectNotes =
                            subjectData[subjectName];


                        subjectButton.innerHTML = `

                            <span class="subject-left">

                                <span class="subject-dot"></span>

                                <span class="subject-title">
                                    ${escapeHTML(
                                        subjectName
                                    )}
                                </span>

                            </span>

                            <span class="subject-right">

                                <span class="subject-count">
                                    ${subjectNotes.length}
                                </span>

                                <span class="subject-arrow">
                                    ▾
                                </span>

                            </span>

                        `;


                        /* =================================================
                           NOTES LIST
                        ================================================= */

                        const notesList =
                            document.createElement("div");


                        notesList.className =
                            "notes-list";


                        const notesInner =
                            document.createElement("div");


                        notesInner.className =
                            "notes-list-inner";


                        subjectNotes.forEach(
                            note => {


                                const noteButton =
                                    document.createElement(
                                        "button"
                                    );


                                noteButton.type =
                                    "button";


                                noteButton.className =
                                    "note-item";


                                noteButton.dataset.title =
                                    (
                                        note.title || ""
                                    ).toLowerCase();


                                noteButton.dataset.search =
                                    `
                                    ${note.title || ""}
                                    ${categoryName}
                                    ${subjectName}
                                    `
                                    .toLowerCase();


                                noteButton.innerHTML = `

                                    <span class="note-item-icon">
                                        📄
                                    </span>

                                    <span class="note-item-title">
                                        ${escapeHTML(
                                            note.title ||
                                            "Untitled Note"
                                        )}
                                    </span>

                                    ${
                                        note.new === true
                                        ? `
                                            <span class="note-new">
                                                𝔫𝔢𝔴
                                            </span>
                                          `
                                        : ""
                                    }

                                `;


                                /* OPEN NOTE */

                                noteButton.addEventListener(
                                    "click",
                                    () => {

                                        openNote(
                                            note,
                                            categoryName,
                                            subjectName,
                                            noteButton
                                        );

                                    }
                                );


                                notesInner.appendChild(
                                    noteButton
                                );

                            }
                        );


                        notesList.appendChild(
                            notesInner
                        );


                        subjectBox.appendChild(
                            subjectButton
                        );


                        subjectBox.appendChild(
                            notesList
                        );


                        subjectsInner.appendChild(
                            subjectBox
                        );


                        /* SUBJECT ACCORDION */

                        subjectButton.addEventListener(
                            "click",
                            event => {

                                event.stopPropagation();


                                subjectBox.classList.toggle(
                                    "open"
                                );


                                subjectButton.classList.toggle(
                                    "active"
                                );

                            }
                        );

                    }
                );


                subjects.appendChild(
                    subjectsInner
                );


                categoryBox.appendChild(
                    categoryButton
                );


                categoryBox.appendChild(
                    subjects
                );


                navigation.appendChild(
                    categoryBox
                );


                /* =================================================
                   CATEGORY ACCORDION
                ================================================= */

                categoryButton.addEventListener(
                    "click",
                    () => {

                        categoryBox.classList.toggle(
                            "open"
                        );


                        categoryButton.classList.toggle(
                            "active"
                        );

                    }
                );

            }
        );

    }


    /* ======================================================
       NORMALIZE CATEGORY
    ====================================================== */

    function normalizeCategory(category) {

        if (!category) {
            return null;
        }


        const value =
            String(category)
                .trim()
                .toLowerCase();


        if (
            value === "rajasthan" ||
            value === "rajasthan gk"
        ) {

            return "Rajasthan GK";

        }


        if (
            value === "india" ||
            value === "india gk"
        ) {

            return "India GK";

        }


        if (value === "science") {
            return "Science";
        }


        if (value === "computer") {
            return "Computer";
        }


        if (
            value === "math" ||
            value === "maths" ||
            value === "mathematics"
        ) {

            return "Mathematics";

        }


        if (value === "reasoning") {
            return "Reasoning";
        }


        if (value === "hindi") {
            return "Hindi";
        }


        if (value === "english") {
            return "English";
        }


        return null;

    }


    /* ======================================================
       OPEN NOTE
    ====================================================== */

    function openNote(
        note,
        category,
        subject,
        button
    ) {


        /*
         Priority:

         1. path
         2. file
         3. url
         4. slug
        */


        let file =
            note.path ||
            note.file ||
            note.url;


        if (!file && note.slug) {

            file = note.slug;

        }


        if (!file) {

            console.error(
                "Note file missing:",
                note
            );

            return;

        }


        /* Remove active */

        document
            .querySelectorAll(
                ".note-item.active"
            )
            .forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


        /* Active note */

        button.classList.add(
            "active"
        );


        /* Breadcrumb */

        if (breadcrumb) {

            breadcrumb.textContent =
                `${category} / ${subject} / ${note.title}`;

        }


        /* Hide welcome */

        if (welcome) {

            welcome.style.display =
                "none";

        }


        /* Open iframe */

        if (frame) {

            frame.hidden = false;


            frame.classList.remove(
                "loaded"
            );


            frame.src = file;


            frame.onload = () => {

                frame.classList.add(
                    "loaded"
                );

            };


            frame.onerror = () => {

                console.error(
                    "Unable to open note:",
                    file
                );

            };

        }


        /* Mobile */

        if (window.innerWidth <= 700) {

            if (sidebar) {

                sidebar.classList.remove(
                    "mobile-open"
                );

            }

        }

    }


    /* ======================================================
       SEARCH
    ====================================================== */

    function setupSearch(notes) {

        if (!searchInput) return;


        searchInput.addEventListener(
            "input",
            () => {


                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const categories =
                    document.querySelectorAll(
                        ".notes-category"
                    );


                categories.forEach(
                    category => {


                        let categoryVisible =
                            false;


                        const subjects =
                            category.querySelectorAll(
                                ".notes-subject"
                            );


                        subjects.forEach(
                            subject => {


                                let subjectVisible =
                                    false;


                                const items =
                                    subject.querySelectorAll(
                                        ".note-item"
                                    );


                                items.forEach(
                                    item => {


                                        const text =
                                            item.dataset.search ||
                                            item.textContent
                                                .toLowerCase();


                                        const matched =
                                            !query ||
                                            text.includes(
                                                query
                                            );


                                        item.classList.toggle(
                                            "search-hidden",
                                            !matched
                                        );


                                        if (matched) {

                                            subjectVisible =
                                                true;

                                        }

                                    }
                                );


                                subject.classList.toggle(
                                    "search-hidden",
                                    !subjectVisible
                                );


                                if (
                                    query &&
                                    subjectVisible
                                ) {

                                    subject.classList.add(
                                        "open"
                                    );


                                    const button =
                                        subject.querySelector(
                                            ".notes-subject-button"
                                        );


                                    if (button) {

                                        button.classList.add(
                                            "active"
                                        );

                                    }

                                }


                                if (subjectVisible) {

                                    categoryVisible =
                                        true;

                                }

                            }
                        );


                        category.classList.toggle(
                            "search-hidden",
                            !categoryVisible
                        );


                        if (
                            query &&
                            categoryVisible
                        ) {

                            category.classList.add(
                                "open"
                            );


                            const button =
                                category.querySelector(
                                    ".notes-category-button"
                                );


                            if (button) {

                                button.classList.add(
                                    "active"
                                );

                            }

                        }

                    }
                );

            }
        );

    }


    /* ======================================================
       MOBILE SIDEBAR
    ====================================================== */

    if (
        sidebarToggle &&
        sidebar
    ) {

        sidebarToggle.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );

    }


    /* ======================================================
       FULLSCREEN
    ====================================================== */

    if (fullscreenButton) {

        fullscreenButton.addEventListener(
            "click",
            () => {


                const content =
                    document.querySelector(
                        ".notes-content"
                    );


                if (!content) return;


                content.classList.toggle(
                    "fullscreen"
                );


                fullscreenButton.textContent =
                    content.classList.contains(
                        "fullscreen"
                    )
                        ? "✕"
                        : "⛶";

            }
        );

    }


    /* ======================================================
       HTML ESCAPE
    ====================================================== */

    function escapeHTML(value) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }

});
