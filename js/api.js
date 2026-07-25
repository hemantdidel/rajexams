/* ==========================================
Load Jobs
========================================== */

async function loadJobs() {

    try {

        const response = await fetch("data/jobs.json");

        const jobs = await response.json();

        const list = document.getElementById("jobsList");

        if (!list) return;

        list.innerHTML = "";

        jobs.forEach(job => {

            list.innerHTML += `

            <li>

                <a href="${job.slug}.html">

                    <span>

                        ➜ ${job.title}

                    </span>

                    ${job.new ? '<span class="new-tag">NEW</span>' : ""}

                </a>

            </li>

            `;

        });

    }

    catch(error){

        console.error("Jobs Loading Error :", error);

    }

}
