/* ==========================================================
   RajExams — Study Notes
   Category → Subject → Notes
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const navigation = document.getElementById("notesNavigation");
    const searchInput = document.getElementById("notesSearch");

    const frame = document.getElementById("notesFrame");
    const welcome = document.getElementById("notesWelcome");

    const breadcrumb = document.getElementById("notesBreadcrumb");

    const sidebar = document.querySelector(".notes-sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    const fullscreenButton =
        document.getElementById("notesFullscreen");

    if (!navigation) return;


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

            buildNotesNavigation(notes);

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

    function buildNotesNavigation(notes) {

        navigation.innerHTML = "";


        /*
         Expected JSON:

         [
           {
             "category": "Rajasthan",
             "subject": "Art & Culture",
             "title": "राजस्थान के प्रमुख मेले",
             "slug": "...",
             "file": "notes/rajasthan/art-culture/....html"
           }
         ]
        */


        const categories = {};


        /* -----------------------------------------------
           GROUP CATEGORY
        ------------------------------------------------ */

        notes.forEach(note => {

            const category =
                note.category || "Other";

            const subject =
                note.subject || "General";


            if (!categories[category]) {

                categories[category] = {};

            }


            if (!categories[category][subject]) {

                categories[category][subject] = [];

            }


            categories[category][subject].push(note);

        });


        /* -----------------------------------------------
           CREATE CATEGORY
        ------------------------------------------------ */

        Object.keys(categories).forEach(
            categoryName => {

                const categoryBox =
                    document.createElement("div");

                categoryBox.className =
                    "notes-category";


                /* Category Button */

                const categoryButton =
                    document.createElement("button");

                categoryButton.type = "button";

                categoryButton.className =
                    "notes-category-button";


                categoryButton.innerHTML = `

                    <span class="category-left">

                        <span class="category-icon">
                            ${getCategoryIcon(categoryName)}
                        </span>

                        <span class="category-title">
                            ${escapeHTML(categoryName)}
                        </span>

                    </span>

                    <span class="category-arrow">
                        ▼
                    </span>

                `;


                /* Subjects Wrapper */

                const subjects =
                    document.createElement("div");

                subjects.className =
                    "notes-subjects";


                const subjectsInner =
                    document.createElement("div");

                subjectsInner.className =
                    "notes-subjects-inner";


                /* -----------------------------------------
                   CREATE SUBJECTS
                ------------------------------------------ */

                Object.keys(
                    categories[categoryName]
                ).forEach(subjectName => {


                    const subjectBox =
                        document.createElement("div");

                    subjectBox.className =
                        "notes-subject";


                    /* Subject Button */

                    const subjectButton =
                        document.createElement("button");

                    subjectButton.type = "button";

                    subjectButton.className =
                        "notes-subject-button";


                    subjectButton.innerHTML = `

                        <span class="subject-left">

                            <span class="subject-dot"></span>

                            <span class="subject-title">
                                ${escapeHTML(subjectName)}
                            </span>

                        </span>

                        <span class="subject-arrow">
                            ▼
                        </span>

                    `;


                    /* Notes wrapper */

                    const notesList =
                        document.createElement("div");

                    notesList.className =
                        "notes-list";


                    const notesListInner =
                        document.createElement("div");

                    notesListInner.className =
                        "notes-list-inner";


                    /* -------------------------------------
                       CREATE NOTES
                    -------------------------------------- */

                    categories[categoryName]
                        [subjectName]
                        .forEach(note => {

                            const noteButton =
                                document.createElement("button");

                            noteButton.type = "button";

                            noteButton.className =
                                "note-item";


                            noteButton.dataset.title =
                                (
                                    note.title || ""
                                ).toLowerCase();

                            noteButton.dataset.category =
                                categoryName.toLowerCase();

                            noteButton.dataset.subject =
                                subjectName.toLowerCase();


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

                            `;


                            /* New badge */

                            if (note.new === true) {

                                noteButton.innerHTML += `

                                    <span style="
                                        margin-left:auto;
                                        font-size:9px;
                                        font-weight:700;
                                        color:#4f46e5;
                                        background:#eef2ff;
                                        padding:2px 5px;
                                        border-radius:5px;
                                    ">
                                        NEW
                                    </span>

                                `;

                            }


                            /* Open Note */

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


                            notesListInner.appendChild(
                                noteButton
                            );

                        });


                    notesList.appendChild(
                        notesListInner
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


                    /* Subject accordion */

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

                });


                subjects.appendChild(
                    subjectsInner
                );


                categoryBox.appendChild(
                    categoryButton
                );

                categoryBox.appendChild(
                    subjects
                );


                subjectsInner
                    .querySelectorAll(".notes-subject")
                    .forEach(subject => {

                        /*
                         No automatic opening.
                        */

                    });


                navigation.appendChild(
                    categoryBox
                );


                /* Category accordion */

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

            });

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

         1. file
         2. url
         3. slug
        */

        let file = note.file || note.url;


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


        /* Remove previous active */

        document
            .querySelectorAll(".note-item.active")
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
                `${category}  /  ${subject}  /  ${note.title}`;

        }


        /* Hide welcome */

        if (welcome) {

            welcome.style.display =
                "none";

        }


        /* Show iframe */

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
       CATEGORY ICONS
    ====================================================== */

    function getCategoryIcon(category) {

        const name =
            category.toLowerCase();


        if (
            name.includes("rajasthan")
        ) {

            return "🏜️";

        }


        if (
            name.includes("india")
        ) {

            return "🇮🇳";

        }


        if (
            name.includes("science")
        ) {

            return "🔬";

        }


        if (
            name.includes("computer")
        ) {

            return "💻";

        }


        if (
            name.includes("math")
        ) {

            return "🧮";

        }


        return "📚";

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
