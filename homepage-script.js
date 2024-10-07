const content = document.querySelector(".content")
const contentCredit = document.querySelector(".credits")

function enterCredits(){
    content.style.display = "none";
    contentCredit.style.display = "flex";
}

function returnToHomepage(){
    content.style.display = "flex";
    contentCredit.style.display = "none";
}
