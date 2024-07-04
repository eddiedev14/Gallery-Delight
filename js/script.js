//Create the variables
const images = document.querySelectorAll(".main__img");
const modalImg = document.querySelector(".modal__img");
const modalImgCard = document.querySelector(".modal__img-card");
const closeModalImgBtn = document.querySelector(".modal__img-button");
const modalImgDownloadBtn = document.querySelector(".modal__img-content__button")

//Function that runs to load all events
document.addEventListener("DOMContentLoaded", loadEventListeners)

function loadEventListeners() {
    //Functions for the modal image
    images.forEach(image => {
        image.addEventListener("click", openModalImg);
    })
    modalImg.addEventListener("keydown", closeModalImg)
    closeModalImgBtn.addEventListener("click", closeModalImg);
}

//Function to open the modal img
function openModalImg(e) {
    //Before showing the modal we need to obtain the src from the image and the class to define the aspect-ratio
    const imgSource = e.target.src;
    const imgSourceDownload = e.target.previousElementSibling ? e.target.previousElementSibling.srcset : e.target.src;
    const articleParent = e.target.parentElement.parentElement;
    
    if (articleParent.classList.contains("tall")) {
        modalImgCard.style.aspectRatio = "9/16";
        modalImgCard.style.minHeight = "initial";
    }else if (articleParent.classList.contains("wide")) {
        modalImgCard.style.aspectRatio = "16/9";
        modalImgCard.style.minHeight = "250px";
    }else{
        modalImgCard.style.aspectRatio = "1/1";
        modalImgCard.style.minHeight = "initial";
    }

    //Place the image in the background
    modalImgCard.style.backgroundImage = `url(${imgSource})`;
    modalImgDownloadBtn.href = imgSourceDownload;
    modalImg.show();
}

//Function to close the modal img
function closeModalImg(e) {
    //Verify if the user has pressed the escape key
    if (e.keyCode && e.keyCode !== 27) { return; };
    modalImg.classList.add("closing");
    setTimeout(() => {
        modalImg.close()
        modalImg.classList.remove("closing");
    }, 500);
}