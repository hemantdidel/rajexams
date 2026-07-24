async function loadBreakingNews(){

    try{

        const res = await fetch("data/breaking-news.json");

        const news = await res.json();

        const marquee = document.getElementById("breakingNews");

        if(!marquee) return;

        marquee.innerHTML = news.map(item =>

            `<a href="${item.url}">${item.title}</a>`

        ).join(" &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp; ");

    }

    catch(err){

        console.log(err);

    }

}

document.addEventListener("DOMContentLoaded",loadBreakingNews);
