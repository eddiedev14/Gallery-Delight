//*Create the variables
const grid = document.querySelector(".main__grid")
let images = document.querySelectorAll(".main__img");
const uploadImageBtn = document.querySelector(".header__cta");
const fixedUploadImageBtn = document.querySelector(".header__cta-fixed");
const footerUploadImageBtn = document.querySelector(".footer__link-upload");

//*Modal Img
const modalImg = document.querySelector(".modal__img");
const modalImgCard = document.querySelector(".modal__img-card");
const modalImgTitle = document.querySelector(".modal__img-content__title");
const modalImgDescription = document.querySelector(".modal__img-content__paragraph");
const closeModalImgBtn = document.querySelector(".modal__img-button");
const modalImgDownloadBtn = document.querySelector(".modal__img-content__button")

//*Modal Form
const modalUpload = document.querySelector(".modal__upload");
const closeModalUploadBtn = document.querySelector(".modal__upload-button");
const cancelModalBtn = document.querySelector(".modal__form-button--cancel")
const modalForm = document.querySelector(".modal__form");
const fileInputContainer = document.querySelector(".modal__form-container");
const fileInput = document.querySelector("#file");
const fileText = document.querySelector(".modal__form-label");
const imageNameInput = document.querySelector("#name");
const imageDescriptionInput = document.querySelector("#description");
const imageCategorieInput = document.querySelector("#categorie");
const imageSizeInput = document.querySelector("#size");
const counterText = document.querySelector(".modal__form-counter")

//Function that runs to load all events
document.addEventListener("DOMContentLoaded", loadEventListeners)

function loadEventListeners() {
    //*Functions for the modal image
    images.forEach(image => {
        image.addEventListener("click", openModalImg);
    })
    modalImg.addEventListener("keydown", (e) => { if (e.keyCode === 27) { closeModal(modalImg); } });
    closeModalImgBtn.addEventListener("click", () => closeModal(modalImg));

    //*Functions for the upload form

    //Functions to handle the opening of the modal
    uploadImageBtn.addEventListener("click", () => modalUpload.show());
    fixedUploadImageBtn.addEventListener("click", () => modalUpload.show());
    footerUploadImageBtn.addEventListener("click", () => modalUpload.show());
    modalUpload.addEventListener("keydown", (e) => { if (e.keyCode === 27) { closeModal(modalUpload, true); } });
    closeModalUploadBtn.addEventListener("click", () => closeModal(modalUpload, true));
    cancelModalBtn.addEventListener("click", () => closeModal(modalUpload, true));

    //Functions to handle the form
    fileInputContainer.addEventListener("click", openFileInput);
    fileInputContainer.addEventListener("keydown", openFileInput);
    fileInput.addEventListener("change", handleFileText);
    imageDescriptionInput.addEventListener("keyup", updateCharacterCounter);
    modalForm.addEventListener("submit", handleFormSubmit);
}

//*Functions for the modal image

//Function to open the modal img
function openModalImg(e) {
    const imgElement = e.nodeName ? e : e.target;

    //Before showing the modal we need to obtain the src from the image and the class to define the aspect-ratio
    const imgSource = imgElement.src;
    const imgSourceDownload = imgElement.previousElementSibling ? imgElement.previousElementSibling.srcset : imgElement.src;
    const articleParent = imgElement.previousElementSibling ? imgElement.parentElement.parentElement : imgElement.parentElement;
    
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
    modalImgTitle.textContent = imgElement.getAttribute("data-title");
    modalImgDescription.textContent = imgElement.alt;
    modalImg.show();
}

//Function to close the modal img
function closeModal(modal, isForm = null) {
    modal.classList.add("closing");
    setTimeout(() => {
        modal.close()
        modal.classList.remove("closing");
        if (isForm) { modalForm.reset(); }
    }, 450);
}

//Function to open the file input
function openFileInput(e) {
    if (e.keyCode && (e.keyCode !== 13)) { return; };
    fileInput.click();
}

//Function to change the text of the label when something is selected in the file input
function handleFileText(e) {
    fileText.textContent = e.target.files[0].name;
    fileText.ariaLabel = "La imagen seleccionada es: " + e.target.files[0].name;
}

function updateCharacterCounter(e) {
    counterText.textContent = `Contador de Caracteres: ${e.target.value.length}/100`;
}

//Function to handle the form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (fileInput.files.length === 0 || imageNameInput.value === "" || imageDescriptionInput.value === "" || imageCategorieInput.value === "" || imageSizeInput.value === "") {
        Swal.fire({
            title: "Error",
            text: "Asegurate de llenar todos los campos",
            icon: "error"
        });
    }

    //Obtaining the image url
    let imgUrl = URL.createObjectURL(fileInput.files[0]);

    //Creating the grid item
    let gridItem = document.createElement("article");
    gridItem.classList.add("main__item");
    if (imageSizeInput.value !== "normal") { gridItem.classList.add(imageSizeInput.value) }
    gridItem.innerHTML = `<img src="${imgUrl}" alt="${imageDescriptionInput.value}" class="main__img" data-filter="${imageCategorieInput.value}" data-title="${imageNameInput.value}" loading="lazy" onclick="openModalImg(this)">`
    grid.appendChild(gridItem);

    Swal.fire({
        title: "Imagen subida",
        text: "La imagen se ha subido correctamente",
        icon: "success"
    });
    closeModal(modalUpload, true);
}