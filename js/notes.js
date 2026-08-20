/* ==========================================================
   RajExams — Study Notes
   Left Notes List + Right Content Viewer
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const notesList = document.getElementById("notesList");
    const noteContent = document.getElementById("noteContent");
    const notesSearch = document.getElementById("notesSearch");
    const notesCategory = document.getElementById("notesCategory");
    const notesSubject = document.getElementById("notesSubject");
    const notesCount = document.getElementById("notesCount");

    if (!notesList || !noteContent) {
        return;
    }

    let allNotes = [];
    let filteredNotes = [];


    /* ======================================================
       Load Notes JSON
    ====================================================== */

    async function loadNotes() {

        try {

            const response = await fetch("data/notes.json");

            if (!response.ok) {
                throw new Error(
                    `Notes JSON Error: ${response.status}`
                );
            }

            allNotes = await response.json();

            filteredNotes = [...allNotes];

            updateCount();

            renderNotes();

            openNoteFromURL();

        }

        catch (error) {

            console.error("Notes Load Error:", error);

            notesList.innerHTML = `
                <div class="notes-error">
                    <strong>Notes Load नहीं हो सके।</strong>
                    <br>
                    कृपया थोड़ी देर बाद फिर प्रयास करें।
                </div>
            `;

        }

    }


    /* ======================================================
       Render Notes List
    ====================================================== */

    function renderNotes() {

        if (!filteredNotes.length) {

            notesList.innerHTML = `
                <div class="notes-empty">
                    कोई Note नहीं मिला।
                </div>
            `;

            updateCount();

            return;
        }


        notesList.innerHTML = filteredNotes.map((note, index) => {

            return `

                <button
                    type="button"
                    class="note-list-item"
                    data-slug="${escapeHTML(note.slug)}"
                    data-index="${index}"
                >

                    <span class="note-list-icon">
                        📄
                    </span>

                    <span class="note-list-info">

                        <span class="note-list-title">

                            ${escapeHTML(note.title)}

                        </span>


                        <span class="note-list-meta">

                            ${escapeHTML(note.category || "")}

                            ${note.subject
                                ? ` • ${escapeHTML(note.subject)}`
                                : ""
                            }

                        </span>

                    </span>


                    ${
                        note.new
                            ? `<span class="note-new-badge">NEW</span>`
                            : ""
                    }

                </button>

            `;

        }).join("");


        /* Add Click Events */

        const noteButtons =
            notesList.querySelectorAll(".note-list-item");


        noteButtons.forEach(button => {

            button.addEventListener("click", () => {

                const slug = button.dataset.slug;

                const note = allNotes.find(
                    item => item.slug === slug
                );

                if (note) {

                    openNote(note);

                }

            });

        });


        updateCount();

    }


    /* ======================================================
       Open Note
    ====================================================== */

    async function openNote(note) {

        if (!note || !note.path) {
            return;
        }


        /* Active item */

        document
            .querySelectorAll(".note-list-item")
            .forEach(item => {

                item.classList.remove("active");

            });


        const activeButton =
            document.querySelector(
                `.note-list-item[data-slug="${cssEscape(note.slug)}"]`
            );


        if (activeButton) {

            activeButton.classList.add("active");

        }


        /* Loading */

        noteContent.innerHTML = `

            <div class="note-content-loading">

                <div class="notes-spinner"></div>

                <p>
                    Note Loading...
                </p>

            </div>

        `;


        try {

            const response = await fetch(note.path);


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );

            }


            const html = await response.text();


            /* ----------------------------------------------
               Extract body content
            ---------------------------------------------- */

            const parser = new DOMParser();

            const documentHTML =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            const body =
                documentHTML.body;


            let content = "";


            if (body) {

                content = body.innerHTML;

            }


            /* ----------------------------------------------
               If body empty
            ---------------------------------------------- */

            if (!content.trim()) {

                content = html;

            }


            /* ----------------------------------------------
               Show Content
            ---------------------------------------------- */

            noteContent.innerHTML = `

                <div class="note-viewer">

                    <div class="note-viewer-header">

                        <div>

                            <span class="note-category">
                                ${escapeHTML(note.category || "Study Notes")}
                            </span>

                            <h2>
                                ${escapeHTML(note.title)}
                            </h2>

                        </div>

                    </div>


                    <div class="note-viewer-body">

                        ${content}

                    </div>

                </div>

            `;


            /* ----------------------------------------------
               URL Update
            ---------------------------------------------- */

            const newURL =
                `${window.location.pathname}?note=${encodeURIComponent(note.slug)}`;

            window.history.replaceState(
                {},
                "",
                newURL
            );


            /* Scroll content to top */

            noteContent.scrollTop = 0;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }


        catch (error) {

            console.error(
                "Note Content Error:",
                error
            );


            noteContent.innerHTML = `

                <div class="note-content-error">

                    <h2>
                        ⚠️ Note Load नहीं हो सका
                    </h2>

                    <p>
                        इस Note की HTML file नहीं मिली।
                    </p>

                    <p>
                        <strong>File:</strong>
                        ${escapeHTML(note.path)}
                    </p>

                </div>

            `;

        }

    }


    /* ======================================================
       Search
    ====================================================== */

    function applyFilters() {

        const searchText =
            (notesSearch?.value || "")
                .trim()
                .toLowerCase();


        const category =
            notesCategory?.value || "all";


        const subject =
            notesSubject?.value || "all";


        filteredNotes = allNotes.filter(note => {

            const title =
                (note.title || "").toLowerCase();


            const noteCategory =
                (note.category || "").toLowerCase();


            const noteSubject =
                (note.subject || "").toLowerCase();


            const matchesSearch =
                !searchText ||
                title.includes(searchText) ||
                noteCategory.includes(searchText) ||
                noteSubject.includes(searchText);


            const matchesCategory =
                category === "all" ||
                note.category === category;


            const matchesSubject =
                subject === "all" ||
                note.subject === subject;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesSubject
            );

        });


        renderNotes();

    }


    /* ======================================================
       Search Events
    ====================================================== */

    if (notesSearch) {

        notesSearch.addEventListener(
            "input",
            applyFilters
        );

    }


    if (notesCategory) {

        notesCategory.addEventListener(
            "change",
            applyFilters
        );

    }


    if (notesSubject) {

        notesSubject.addEventListener(
            "change",
            applyFilters
        );

    }


    /* ======================================================
       Notes Count
    ====================================================== */

    function updateCount() {

        if (!notesCount) {
            return;
        }


        const count =
            filteredNotes.length;


        notesCount.textContent =
            `${count} Notes`;

    }


    /* ======================================================
       Open Note From URL
    ====================================================== */

    function openNoteFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const slug =
            params.get("note");


        if (slug) {

            const note =
                allNotes.find(
                    item => item.slug === slug
                );


            if (note) {

                openNote(note);

                return;

            }

        }


        /* ----------------------------------------------
           No URL Note → Open First Note
        ---------------------------------------------- */

        if (allNotes.length) {

            openNote(allNotes[0]);

        }

    }


    /* ======================================================
       HTML Escape
    ====================================================== */

    function escapeHTML(value) {

        if (value === undefined || value === null) {
            return "";
        }


        return String(value)

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    /* ======================================================
       CSS Escape
    ====================================================== */

    function cssEscape(value) {

        if (
            window.CSS &&
            typeof window.CSS.escape === "function"
        ) {

            return window.CSS.escape(value);

        }


        return String(value)
            .replace(/([^\w-])/g, "\\$1");

    }


    /* ======================================================
       Browser Back / Forward
    ====================================================== */

    window.addEventListener(
        "popstate",
        () => {

            openNoteFromURL();

        }
    );


    /* ======================================================
       START
    ====================================================== */

    loadNotes();

});
