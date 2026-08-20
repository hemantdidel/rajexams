console.log("notes.js Loaded");


/* =========================================
   RAJEXAMS NOTES SYSTEM
========================================= */

let allNotes = [];

let currentNote = null;


/* =========================================
   LOAD NOTES JSON
========================================= */

async function loadNotes() {

    const notesList = document.getElementById("notesList");
    const notesContent = document.getElementById("notesContent");
    const notesCount = document.getElementById("notesCount");

    if (!notesList || !notesContent) {

        console.error("Notes elements not found");

        return;

    }


    try {

        notesContent.innerHTML = `
            <div class="notes-loading">
                Notes loading...
            </div>
        `;


        const response = await fetch("data/notes.json", {
            cache: "no-cache"
        });


        if (!response.ok) {

            throw new Error(
                `notes.json not found (${response.status})`
            );

        }


        allNotes = await response.json();


        if (!Array.isArray(allNotes)) {

            throw new Error(
                "notes.json format is invalid"
            );

        }


        if (notesCount) {

            notesCount.textContent =
                `${allNotes.length} Notes`;

        }


        renderNotes(allNotes);


        /*
         * Automatically open first note
         */

        if (allNotes.length > 0) {

            openNote(allNotes[0]);

        } else {

            notesContent.innerHTML = `
                <div class="notes-welcome">

                    <div class="notes-welcome-icon">
                        📚
                    </div>

                    <h2>
                        No Notes Found
                    </h2>

                    <p>
                        अभी कोई Study Note उपलब्ध नहीं है।
                    </p>

                </div>
            `;

        }


    } catch (error) {

        console.error("Notes Error:", error);


        notesList.innerHTML = `
            <li>
                <div class="notes-error">
                    Notes load नहीं हो सके।
                </div>
            </li>
        `;


        notesContent.innerHTML = `
            <div class="notes-error">

                <strong>
                    Notes load नहीं हो सके।
                </strong>

                <br><br>

                ${error.message}

            </div>
        `;

    }

}


/* =========================================
   RENDER NOTES LIST
========================================= */

function renderNotes(notes) {

    const notesList =
        document.getElementById("notesList");


    if (!notesList) return;


    notesList.innerHTML = "";


    if (notes.length === 0) {

        notesList.innerHTML = `
            <li>
                <div style="
                    padding:20px;
                    text-align:center;
                    color:#64748b;
                ">
                    कोई Note नहीं मिला।
                </div>
            </li>
        `;

        return;

    }


    notes.forEach((note) => {

        const li =
            document.createElement("li");


        const button =
            document.createElement("button");


        button.type = "button";

        button.className = "note-item";

        button.textContent =
            note.title || note.file;


        button.addEventListener(
            "click",
            () => openNote(note)
        );


        li.appendChild(button);

        notesList.appendChild(li);

    });

}


/* =========================================
   OPEN NOTE
========================================= */

async function openNote(note) {

    const notesContent =
        document.getElementById("notesContent");


    if (!notesContent || !note) return;


    currentNote = note;


    /*
     * Active item
     */

    document
        .querySelectorAll(".note-item")
        .forEach((item) => {

            item.classList.remove("active");

            if (
                item.textContent.trim() ===
                (note.title || note.file).trim()
            ) {

                item.classList.add("active");

            }

        });


    /*
     * Loading
     */

    notesContent.innerHTML = `
        <div class="notes-loading">
            Note loading...
        </div>
    `;


    try {

        /*
         * File path
         */

        const filePath =
            `notes/${encodeURIComponent(note.file)}`;


        const response =
            await fetch(filePath);


        if (!response.ok) {

            throw new Error(
                `File not found: ${note.file}`
            );

        }


        const html =
            await response.text();


        /*
         * Parse HTML
         */

        const parser =
            new DOMParser();


        const documentData =
            parser.parseFromString(
                html,
                "text/html"
            );


        /*
         * Extract body
         */

        const bodyContent =
            documentData.body;


        if (!bodyContent) {

            throw new Error(
                "HTML content not found"
            );

        }


        /*
         * Create content wrapper
         */

        const wrapper =
            document.createElement("div");


        wrapper.className =
            "loaded-note-content";


        /*
         * Add selected note title
         */

        const title =
            document.createElement("h1");


        title.textContent =
            note.title || "Study Note";


        wrapper.appendChild(title);


        /*
         * Add original HTML body
         */

        while (bodyContent.firstChild) {

            wrapper.appendChild(
                bodyContent.firstChild
            );

        }


        /*
         * Display
         */

        notesContent.innerHTML = "";

        notesContent.appendChild(wrapper);


        /*
         * Change browser title
         */

        document.title =
            `${note.title || "Study Notes"} | RajExams`;


    } catch (error) {

        console.error(
            "Note Open Error:",
            error
        );


        notesContent.innerHTML = `
            <div class="notes-error">

                <strong>
                    Note open नहीं हो सका।
                </strong>

                <br><br>

                ${error.message}

            </div>
        `;

    }

}


/* =========================================
   SEARCH
========================================= */

function setupNotesSearch() {

    const searchInput =
        document.getElementById("notesSearch");


    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        function () {

            const query =
                this.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                renderNotes(allNotes);

                return;

            }


            const filteredNotes =
                allNotes.filter((note) => {

                    const title =
                        (note.title || "")
                            .toLowerCase();

                    const category =
                        (note.category || "")
                            .toLowerCase();

                    const subject =
                        (note.subject || "")
                            .toLowerCase();


                    return (
                        title.includes(query) ||
                        category.includes(query) ||
                        subject.includes(query)
                    );

                });


            renderNotes(filteredNotes);

        }
    );

}


/* =========================================
   INIT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadNotes();

        setupNotesSearch();

    }
);
