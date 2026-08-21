/* ==========================================================
   RajExams — Study Notes
   Category → Subject → Notes
   8 Categories + Counts + Search + Accordion + Animation
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
       CATEGORY ORDER
    ====================================================== */

    const categoryOrder = [

        "Rajasthan GK",
        "India GK",
        "Science",
        "Computer",
        "Math",
        "Reasoning",
        "Hindi",
        "English"

    ];


    /* ======================================================
       CATEGORY ICONS
    ====================================================== */

    const categoryIcons = {

        "Rajasthan GK": "🏜️",
        "India GK": "🇮🇳",
        "Science": "🔬",
        "Computer": "💻",
        "Math": "🧮",
        "Reasoning": "🧠",
        "Hindi": "अ",
        "English": "A"

    };


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

            setupSearch(notes);

        })

        .catch(error => {

            console.error(
                "Notes Loading Error:",
                error
            );

            navigation.innerHTML = `

                <div class="notes-error">

                    <span class="error-icon">⚠️</span>

                    <div>

                        <strong>Notes load नहीं हो सके</strong>

                        <small>
                            data/notes.json check करें
                        </small>

                    </div>

                </div>

            `;

        });


    /* ======================================================
       BUILD NOTES NAVIGATION
    ====================================================== */

    function buildNotesNavigation(notes) {

        navigation.innerHTML = "";


        /* --------------------------------------------------
           GROUP DATA
        -------------------------------------------------- */

        const grouped = {};


        categoryOrder.forEach(category => {

            grouped[category] = {};

        });


        notes.forEach(note => {

            const category =
                note.category || "Other";

            const subject =
                note.subject || "General";


            if (!grouped[category]) {

                grouped[category] = {};

            }


            if (!grouped[category][subject]) {

                grouped[category][subject] = [];

            }


            grouped[category][subject].push(note);

        });


        /* --------------------------------------------------
           SORT CATEGORIES
        -------------------------------------------------- */

        const categories = Object.keys(grouped);


        categories.sort((a, b) => {

            const aIndex =
                categoryOrder.indexOf(a);

            const bIndex =
                categoryOrder.indexOf(b);


            if (aIndex === -1 && bIndex === -1) {

                return a.localeCompare(b);

            }


            if (aIndex === -1) return 1;

            if (bIndex === -1) return -1;


            return aIndex - bIndex;

        });


        /* --------------------------------------------------
           CREATE CATEGORY
        -------------------------------------------------- */

        categories.forEach(categoryName => {

            const subjectsData =
                grouped[categoryName];


            const categoryTotal =
                Object.values(subjectsData)
                    .reduce(
                        (total, list) =>
                            total + list.length,
                        0
                    );


            /* Skip completely empty category */

            if (categoryTotal === 0) return;


            const categoryBox =
                document.createElement("div");

            categoryBox.className =
                "notes-category";


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
                        ${getCategoryIcon(categoryName)}
                    </span>

                    <span class="category-title">
                        ${escapeHTML(categoryName)}
                    </span>

                </span>


                <span class="category-right">

                    <span class="category-count">
                        ${categoryTotal}
                    </span>

                    <span class="category-arrow">
                        <span>⌄</span>
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
               SUBJECTS
            ================================================== */

            Object.keys(subjectsData)
                .forEach(subjectName => {

                    const subjectNotes =
                        subjectsData[subjectName];


                    const subjectBox =
                        document.createElement("div");

                    subjectBox.className =
                        "notes-subject";


                    /* ------------------------------------------
                       SUBJECT BUTTON
                    ------------------------------------------ */

                    const subjectButton =
                        document.createElement("button");

                    subjectButton.type =
                        "button";

                    subjectButton.className =
                        "notes-subject-button";


                    subjectButton.innerHTML = `

                        <span class="subject-left">

                            <span class="subject-line"></span>

                            <span class="subject-title">
                                ${escapeHTML(subjectName)}
                            </span>

                        </span>


                        <span class="subject-right">

                            <span class="subject-count">
                                ${subjectNotes.length}
                            </span>

                            <span class="subject-arrow">
                                ⌄
                            </span>

                        </span>

                    `;


                    /* ------------------------------------------
                       NOTES WRAPPER
                    ------------------------------------------ */

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


                        /* Search metadata */

                        noteButton.dataset.title =
                            String(
                                note.title || ""
                            ).toLowerCase();


                        noteButton.dataset.category =
                            categoryName.toLowerCase();


                        noteButton.dataset.subject =
                            subjectName.toLowerCase();


                        /* ------------------------------------------
                           NOTE HTML
                        ------------------------------------------ */

                        noteButton.innerHTML = `

                            <span class="note-item-icon">
                                <span>📄</span>
                            </span>

                            <span class="note-item-title">
                                ${escapeHTML(
                                    note.title ||
                                    "Untitled Note"
                                )}
                            </span>

                        `;


                        /* ------------------------------------------
                           NEW BADGE
                        ------------------------------------------ */

                        if (note.new === true) {

                            noteButton.innerHTML += `

                                <span class="note-new-badge">

                                    <span class="new-dot"></span>

                                    NEW

                                </span>

                            `;

                        }


                        /* ------------------------------------------
                           NOTE CLICK
                        ------------------------------------------ */

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

        /* --------------------------------------------------
           FIND FILE PATH
        -------------------------------------------------- */

        let file =
            note.path ||
            note.file ||
            note.url;


        /* --------------------------------------------------
           SLUG FALLBACK
        -------------------------------------------------- */

        if (!file && note.slug) {

            file =
                "notes/" +
                note.slug +
                ".html";

        }


        if (!file) {

            console.error(
                "Note file/path missing:",
                note
            );

            return;

        }


        /* --------------------------------------------------
           REMOVE OLD ACTIVE
        -------------------------------------------------- */

        document
            .querySelectorAll(
                ".note-item.active"
            )
            .forEach(item => {

                item.classList.remove(
                    "active"
                );

            });


        /* --------------------------------------------------
           ACTIVE NOTE
        -------------------------------------------------- */

        button.classList.add(
            "active"
        );


        /* --------------------------------------------------
           BREADCRUMB
        -------------------------------------------------- */

        if (breadcrumb) {

            breadcrumb.textContent =
                `${category}  /  ${subject}  /  ${note.title}`;

        }


        /* --------------------------------------------------
           HIDE WELCOME
        -------------------------------------------------- */

        if (welcome) {

            welcome.style.display =
                "none";

        }


        /* --------------------------------------------------
           SHOW IFRAME
        -------------------------------------------------- */

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


        /* --------------------------------------------------
           MOBILE
        -------------------------------------------------- */

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


                                /* Auto open */

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


                        /* Auto open category */

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
       CATEGORY ICON
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


        if (
            name.includes("reasoning")
        ) {

            return "🧠";

        }


        if (
            name.includes("hindi")
        ) {

            return "अ";

        }


        if (
            name.includes("english")
        ) {

            return "A";

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
