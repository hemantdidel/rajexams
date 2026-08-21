/* ==========================================================
   RajExams — Study Notes
   8 Categories → Subjects → Notes
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const navigation =
        document.getElementById("notesNavigation");

    const searchInput =
        document.getElementById("notesSearch");

    const frame =
        document.getElementById("notesFrame");

    const welcome =
        document.getElementById("notesWelcome");

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
       FIXED 8 CATEGORIES
    ====================================================== */

    const CATEGORY_CONFIG = [

        {
            name: "Rajasthan GK",
            key: "Rajasthan",
            icon: "🏜️"
        },

        {
            name: "India GK",
            key: "India",
            icon: "🇮🇳"
        },

        {
            name: "Science",
            key: "Science",
            icon: "🔬"
        },

        {
            name: "Computer",
            key: "Computer",
            icon: "💻"
        },

        {
            name: "Math",
            key: "Math",
            icon: "🧮"
        },

        {
            name: "Reasoning",
            key: "Reasoning",
            icon: "🧠"
        },

        {
            name: "Hindi",
            key: "Hindi",
            icon: "अ"
        },

        {
            name: "English",
            key: "English",
            icon: "A"
        }

    ];


    /* ======================================================
       LOAD NOTES JSON
    ====================================================== */

    fetch("data/notes.json")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load data/notes.json"
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

            buildNotesNavigation(notes);

            setupSearch();

        })

        .catch(error => {

            console.error(
                "Notes Loading Error:",
                error
            );

            navigation.innerHTML = `

                <div class="notes-empty-search">

                    <strong>Notes load नहीं हो सके।</strong>

                    <br>

                    कृपया data/notes.json
                    check करें।

                </div>

            `;

        });


    /* ======================================================
       BUILD NAVIGATION
    ====================================================== */

    function buildNotesNavigation(notes) {

        navigation.innerHTML = "";


        /* -----------------------------------------------
           GROUP NOTES
        ------------------------------------------------ */

        const grouped = {};


        CATEGORY_CONFIG.forEach(category => {

            grouped[category.key] = [];

        });


        notes.forEach(note => {

            if (!note) return;


            const category =
                note.category || "";


            const matchingCategory =
                CATEGORY_CONFIG.find(
                    item =>
                        item.key.toLowerCase() ===
                        category.toLowerCase()
                );


            if (matchingCategory) {

                grouped[
                    matchingCategory.key
                ].push(note);

            }

        });


        /* -----------------------------------------------
           CREATE 8 CATEGORIES
        ------------------------------------------------ */

        CATEGORY_CONFIG.forEach(
            categoryConfig => {

                const categoryNotes =
                    grouped[
                        categoryConfig.key
                    ] || [];


                createCategory(
                    categoryConfig,
                    categoryNotes
                );

            }
        );

    }


    /* ======================================================
       CREATE CATEGORY
    ====================================================== */

    function createCategory(
        categoryConfig,
        categoryNotes
    ) {

        const categoryBox =
            document.createElement("div");

        categoryBox.className =
            "notes-category";


        categoryBox.dataset.category =
            categoryConfig.key.toLowerCase();


        /* ==================================================
           CATEGORY BUTTON
        ================================================== */

        const categoryButton =
            document.createElement("button");

        categoryButton.type = "button";

        categoryButton.className =
            "notes-category-button";


        categoryButton.innerHTML = `

            <span class="category-left">

                <span class="category-icon">

                    ${categoryConfig.icon}

                </span>

                <span class="category-title">

                    ${escapeHTML(
                        categoryConfig.name
                    )}

                </span>

            </span>


            <span class="category-right">

                <span class="category-count">

                    ${categoryNotes.length}

                </span>

                <span class="category-arrow">

                    ▼

                </span>

            </span>

        `;


        /* ==================================================
           SUBJECT WRAPPER
        ================================================== */

        const subjects =
            document.createElement("div");

        subjects.className =
            "notes-subjects";


        const subjectsInner =
            document.createElement("div");

        subjectsInner.className =
            "notes-subjects-inner";


        /* ==================================================
           NO NOTES
        ================================================== */

        if (categoryNotes.length === 0) {

            const empty =
                document.createElement("div");

            empty.className =
                "notes-category-empty";


            empty.innerHTML = `

                <span>📚</span>

                <span>
                    Notes जल्द उपलब्ध होंगे
                </span>

            `;


            subjectsInner.appendChild(
                empty
            );

        }


        /* ==================================================
           GROUP SUBJECTS
        ================================================== */

        const subjectGroups = {};


        categoryNotes.forEach(note => {

            const subject =
                note.subject ||
                "General";


            if (!subjectGroups[subject]) {

                subjectGroups[subject] = [];

            }


            subjectGroups[subject].push(
                note
            );

        });


        /* ==================================================
           CREATE SUBJECTS
        ================================================== */

        Object.keys(subjectGroups)
            .forEach(subjectName => {

                createSubject(
                    subjectsInner,
                    categoryConfig,
                    subjectName,
                    subjectGroups[
                        subjectName
                    ]
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


        navigation.appendChild(
            categoryBox
        );


        /* ==================================================
           CATEGORY ACCORDION
        ================================================== */

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


    /* ======================================================
       CREATE SUBJECT
    ====================================================== */

    function createSubject(
        container,
        categoryConfig,
        subjectName,
        subjectNotes
    ) {

        const subjectBox =
            document.createElement("div");

        subjectBox.className =
            "notes-subject";


        subjectBox.dataset.subject =
            subjectName.toLowerCase();


        /* ==================================================
           SUBJECT BUTTON
        ================================================== */

        const subjectButton =
            document.createElement("button");

        subjectButton.type = "button";

        subjectButton.className =
            "notes-subject-button";


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

                    ▼

                </span>

            </span>

        `;


        /* ==================================================
           NOTES WRAPPER
        ================================================== */

        const notesList =
            document.createElement("div");

        notesList.className =
            "notes-list";


        const notesListInner =
            document.createElement("div");

        notesListInner.className =
            "notes-list-inner";


        /* ==================================================
           CREATE NOTE ITEMS
        ================================================== */

        subjectNotes.forEach(note => {

            const noteButton =
                document.createElement("button");

            noteButton.type =
                "button";

            noteButton.className =
                "note-item";


            noteButton.dataset.title =
                (
                    note.title || ""
                ).toLowerCase();


            noteButton.dataset.category =
                categoryConfig.name.toLowerCase();


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


            /* ==================================================
               NEW BADGE
            ================================================== */

            if (note.new === true) {

                const badge =
                    document.createElement("span");

                badge.className =
                    "note-new-badge";

                badge.textContent =
                    "NEW";


                noteButton.appendChild(
                    badge
                );

            }


            /* ==================================================
               OPEN NOTE
            ================================================== */

            noteButton.addEventListener(
                "click",
                () => {

                    openNote(
                        note,
                        categoryConfig.name,
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


        container.appendChild(
            subjectBox
        );


        /* ==================================================
           SUBJECT ACCORDION
        ================================================== */

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


    /* ======================================================
       OPEN NOTE
    ====================================================== */

    function openNote(
        note,
        category,
        subject,
        button
    ) {

        /* -----------------------------------------------
           FILE PATH
        ------------------------------------------------ */

        let file =
            note.path ||
            note.file ||
            note.url;


        /* -----------------------------------------------
           SLUG FALLBACK
        ------------------------------------------------ */

        if (!file && note.slug) {

            file =
                `notes/${note.slug}.html`;

        }


        /* -----------------------------------------------
           FILE MISSING
        ------------------------------------------------ */

        if (!file) {

            console.error(
                "Note file missing:",
                note
            );

            return;

        }


        console.log(
            "Opening Note:",
            file
        );


        /* -----------------------------------------------
           ACTIVE NOTE
        ------------------------------------------------ */

        document
            .querySelectorAll(
                ".note-item.active"
            )
            .forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


        button.classList.add(
            "active"
        );


        /* -----------------------------------------------
           OPEN PARENT ACCORDIONS
        ------------------------------------------------ */

        const subjectBox =
            button.closest(
                ".notes-subject"
            );


        const categoryBox =
            button.closest(
                ".notes-category"
            );


        if (subjectBox) {

            subjectBox.classList.add(
                "open"
            );

        }


        if (categoryBox) {

            categoryBox.classList.add(
                "open"
            );

        }


        /* -----------------------------------------------
           BREADCRUMB
        ------------------------------------------------ */

        if (breadcrumb) {

            breadcrumb.textContent =
                `${category} / ${subject} / ${note.title}`;

        }


        /* -----------------------------------------------
           HIDE WELCOME
        ------------------------------------------------ */

        if (welcome) {

            welcome.style.display =
                "none";

        }


        /* -----------------------------------------------
           SHOW FRAME
        ------------------------------------------------ */

        if (frame) {

            frame.hidden =
                false;


            frame.classList.remove(
                "loaded"
            );


            frame.src =
                file;


            frame.onload =
                () => {

                    frame.classList.add(
                        "loaded"
                    );

                };


            frame.onerror =
                () => {

                    console.error(
                        "Unable to load note:",
                        file
                    );

                };

        }


        /* -----------------------------------------------
           MOBILE
        ------------------------------------------------ */

        if (
            window.innerWidth <= 700
        ) {

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

    function setupSearch() {

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


                        const categoryText =
                            category
                                .textContent
                                .toLowerCase();


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
                                            (
                                                item
                                                    .dataset
                                                    .title ||
                                                item
                                                    .textContent ||
                                                ""
                                            )
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


                                /* Subject */

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


                        /* Category */

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
