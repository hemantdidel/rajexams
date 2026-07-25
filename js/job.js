/* ==========================================
   RajExams - Master Job Page
   job.js
========================================== */

console.log("job.js Loaded");

/* ==========================================
   Helpers
========================================== */

const $ = (id) => document.getElementById(id);

/* ==========================================
   Load JSON
========================================== */

async function getJSON(path) {

    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Failed to load ${path}`);
    }

    return await response.json();

}

/* ==========================================
   Load Current Job
========================================== */

async function loadJob() {

    try {

        // URL Example:
        // job.html?slug=rssb-cet-graduate-level-2026

        const params = new URLSearchParams(window.location.search);

        const slug = params.get("slug");

        if (!slug) {

            throw new Error("Job slug not found.");

        }

        const job = await getJSON(

            `data/jobs/${slug}.json`

        );

        renderJob(job);

    }

    catch (error) {

        console.error(error);

        showError(error.message);

    }

}

/* ==========================================
   Main Renderer
========================================== */

function renderJob(job){

    renderHero(job);

    renderTables(job);

    renderSections(job);

    renderExtras(job);

}

/* ==========================================
   Hero
========================================== */

function renderHero(job){

    document.title = job.title;

    $("breadcrumbTitle").textContent = job.title;

    $("jobTitle").textContent = job.title;

    $("jobBadge").textContent = job.badge;

    $("jobDescription").textContent = job.description;

    $("shortInformation").textContent = job.shortInformation;

}

/* ==========================================
   Error
========================================== */

function showError(message){

    document.body.innerHTML = `

    <div class="container">

        <div
            class="job-card"
            style="margin:40px 0;">

            <div class="section-title">

                Error

            </div>

            <div class="section-content">

                ${message}

            </div>

        </div>

    </div>

    `;

}

/* ==========================================
   Reusable Table Renderer
========================================== */

function renderTable(elementId, data, labels) {

    const table = $(elementId);

    if (!table || !data) return;

    table.innerHTML = "";

    Object.entries(data).forEach(([key, value]) => {

        table.innerHTML += `

        <tr>

            <td>${labels[key] || key}</td>

            <td>${value}</td>

        </tr>

        `;

    });

}

/* ==========================================
   Render All Tables
========================================== */

function renderTables(job){

    renderTable(

        "importantDates",

        job.importantDates,

        {

            applicationBegin:"Application Begin",

            lastDate:"Last Date",

            feePayment:"Fee Payment Last Date",

            correctionDate:"Correction Date",

            examDate:"Exam Date",

            admitCard:"Admit Card"

        }

    );

    renderTable(

        "applicationFee",

        job.applicationFee,

        {

            general:"General / OBC",

            obc:"OBC / EWS",

            scst:"SC / ST",

            paymentMode:"Payment Mode"

        }

    );

    renderTable(

        "ageLimit",

        job.ageLimit,

        {

            minimum:"Minimum Age",

            maximum:"Maximum Age",

            relaxation:"Age Relaxation"

        }

    );

    renderTable(

        "salaryDetails",

        job.salary,

        {

            payLevel:"Pay Level",

            basicPay:"Basic Pay",

            gradePay:"Grade Pay",

            allowances:"Allowances"

        }

    );

}

/* ==========================================
   Reusable List Renderer
========================================== */

function renderList(elementId,data){

    const container=$(elementId);

    if(!container || !data) return;

    container.innerHTML="<ul class='job-list'></ul>";

    const list=container.querySelector("ul");

    data.forEach(item=>{

        list.innerHTML+=`

        <li>${item}</li>

        `;

    });

}

/* ==========================================
   Vacancy Details
========================================== */

function renderVacancy(data){

    const table=$("vacancyDetails");

    if(!table || !data) return;

    table.innerHTML="";

    data.forEach(item=>{

        table.innerHTML+=`

        <tr>

            <td>${item.post}</td>

            <td>${item.vacancies}</td>

        </tr>

        `;

    });

}

/* ==========================================
   Eligibility
========================================== */

function renderEligibility(data){

    const container=$("eligibilityDetails");

    if(!container || !data) return;

    container.innerHTML="";

    data.forEach(item=>{

        container.innerHTML+=`

        <div class="eligibility-item">

            <h3>${item.post}</h3>

            <p>${item.qualification}</p>

        </div>

        `;

    });

}

/* ==========================================
   Selection Process
========================================== */

function renderSelection(data){

    const container = $("selectionProcess");

    if(!container || !data) return;

    container.innerHTML = "<ul class='selection-list'></ul>";

    const list = container.querySelector("ul");

    data.forEach(item=>{

        list.innerHTML += `

        <li>${item}</li>

        `;

    });

}

/* ==========================================
   Exam Pattern
========================================== */

function renderExamPattern(data){

    const table = $("examPattern");

    if(!table || !data) return;

    table.innerHTML = "";

    data.forEach(item=>{

        table.innerHTML += `

        <tr>

            <td>${item.subject}</td>

            <td>${item.questions}</td>

            <td>${item.marks}</td>

        </tr>

        `;

    });

}

/* ==========================================
   Important Links
========================================== */

function renderImportantLinks(data){

    const table = $("importantLinks");

    if(!table || !data) return;

    table.innerHTML = "";

    data.forEach(item=>{

        table.innerHTML += `

        <tr>

            <td>${item.title}</td>

            <td>

                <a
                    href="${item.url}"
                    target="_blank"
                    class="link-btn">

                    Open

                </a>

            </td>

        </tr>

        `;

    });

}

/* ==========================================
   FAQ
========================================== */

function renderFAQ(data){

    const container = $("faqContainer");

    if(!container || !data) return;

    container.innerHTML = "";

    data.forEach(item=>{

        container.innerHTML += `

        <div class="faq-item">

            <button class="faq-question">

                <span>${item.question}</span>

                <span class="faq-icon">+</span>

            </button>

            <div class="faq-answer">

                ${item.answer}

            </div>

        </div>

        `;

    });

    document
        .querySelectorAll(".faq-question")
        .forEach(button=>{

            button.onclick = function(){

                this.parentElement.classList.toggle("active");

            };

        });

}

/* ==========================================
Author & Disclaimer
========================================== */

function renderAuthor(job){

    if(job.author){

        $("authorName").textContent =

            job.author.name;

        $("authorDescription").textContent =

            job.author.description;

    }

    renderList(

        "disclaimer",

        job.disclaimer

    );

    $("disclaimer").classList.add(

        "disclaimer-box"

    );

}

/* ==========================================
   Render Sections
========================================== */

function renderSections(job){

    renderVacancy(

        job.vacancyDetails

    );

    renderEligibility(

        job.eligibility

    );

    renderSelection(

        job.selectionProcess

    );

    renderExamPattern(

        job.examPattern

    );

    renderImportantLinks(

        job.importantLinks

    );

    renderList(

        "documentsRequired",

        job.documentsRequired

    );

    renderList(

        "howToApply",

        job.howToApply

    );

   renderList(

    "importantInstructions",

    job.importantInstructions

);

    renderFAQ(

        job.faq

    );
   
   renderAuthor(job);

}

/* ==========================================
   Related Jobs
========================================== */

async function loadRelatedJobs(currentSlug){

    try{

        const jobs = await getJSON("data/jobs-list.json");

        const container = $("relatedJobs");

        if(!container) return;

        container.innerHTML = "";

        jobs.forEach(job=>{

            if(job.slug === currentSlug) return;

            container.innerHTML += `

            <li>

                <a href="${job.url}">

                    ➜ ${job.title}

                </a>

            </li>

            `;

        });

    }

    catch(error){

        console.error(error);

    }

}

/* ==========================================
   Render Extras
========================================== */

function renderExtras(job){

    loadRelatedJobs(job.slug);

    initShareButtons();

    initPageTools(job);

}

/* ==========================================
Share Buttons
========================================== */

function initShareButtons(){

    const url = window.location.href;

    const title = document.title;

    $("shareWhatsApp").onclick = () => {

        window.open(

            `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,

            "_blank"

        );

    };

    $("shareTelegram").onclick = () => {

        window.open(

            `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,

            "_blank"

        );

    };

    $("shareFacebook").onclick = () => {

        window.open(

            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,

            "_blank"

        );

    };

    $("copyLink").onclick = async () => {

        await navigator.clipboard.writeText(url);

        alert("Link copied successfully!");

    };

}

/* ==========================================
Page Tools
========================================== */

function initPageTools(job){

    $("lastUpdated").textContent =

        job.lastUpdated;

    $("printPage").onclick = ()=>{

        window.print();

    };

}

/* ==========================================
   Init
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadJob();

    }

);

