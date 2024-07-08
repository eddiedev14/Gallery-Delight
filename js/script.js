//*Create the variables
const grid = document.querySelector(".main__grid")
const images = document.querySelectorAll(".main__img");
const uploadImageBtn = document.querySelector(".header__cta");
const fixedUploadImageBtn = document.querySelector(".header__cta-fixed");
const footerUploadImageBtn = document.querySelector(".footer__link-upload");
const filterSelect = document.querySelector("#filter");
const emptyGridItem = document.querySelector(".main__item--empty")

//*Modal Img
const modalImg = document.querySelector(".modal__img");
const modalImgCard = document.querySelector(".modal__img-card");
const modalImgTitle = document.querySelector(".modal__img-content__title");
const modalImgDescription = document.querySelector(".modal__img-content__paragraph");
const closeModalImgBtn = document.querySelector(".modal__img-button");
const modalImgDownloadBtn = document.querySelector(".modal__img-content__button--download");
const modalImgDeleteBtn = document.querySelector(".modal__img-content__button--remove");

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
const counterText = document.querySelector(".modal__form-counter")

//Function that runs to load all events
document.addEventListener("DOMContentLoaded", loadEventListeners)

function loadEventListeners() {
    //*Functions for filtering
    filterSelect.addEventListener("change", filterImages);

    //*Functions for the modal image
    images.forEach(image => {
        image.addEventListener("click", openModalImg);
    })
    modalImg.addEventListener("keydown", (e) => { if (e.keyCode === 27) { closeModal(modalImg); } });
    closeModalImgBtn.addEventListener("click", () => closeModal(modalImg));
    modalImgDeleteBtn.addEventListener("click", removeImage);

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

//*Functions for filtering
function filterImages(e, currentFilterValue = null) {
    const filterValue = currentFilterValue ? currentFilterValue : e.target.value;
    const currentImages = document.querySelectorAll(`.main__item`);
    let filteredImagesLength = 0;

    //If the empty grid item is showing, we hide it
    if (emptyGridItem.classList.contains("show")) {
        setTimeout(() => { emptyGridItem.classList.remove("show") }, 500);
    }

    grid.classList.add("disappear");
    
    setTimeout(() => {
        currentImages.forEach(image => {
            const imgElement = image.querySelector('.main__img');
            //The isFilterMatch variable will be true if the filter value is empty or if the filter matches the selected value; otherwise it will be false.
            const isFilterMatch = filterValue === '' || imgElement.getAttribute('data-filter') === filterValue;

            //If the image is visible, we show it; otherwise we hide it.
            image.style.display = isFilterMatch ? 'block' : 'none';
            image.dataset.visible = isFilterMatch;

            if (isFilterMatch) {
                filteredImagesLength++;
            }
        });

        grid.classList.replace('disappear', 'appear');

        if (filteredImagesLength === 0){
            emptyGridItem.classList.add("show")
        }
        else if (filteredImagesLength === 1) {
            document.querySelector('.main__item[data-visible = "true"]').style.maxWidth = '300px';
        }
    }, 500);
    //Remove the class appear
    grid.classList.remove("appear");
}

//*Functions for the modal image

//Function to open the modal img
function openModalImg(e) {
    const imgElement = e.nodeName ? e : e.target;

    //Before showing the modal we need to obtain the src from the image and the class to define the aspect-ratio
    const imgSource = imgElement.src;
    const articleParent = imgElement.parentElement.parentElement;
    articleParent.dataset.showing = true;
    
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
    modalImgDownloadBtn.href = imgSource;
    modalImgTitle.textContent = imgElement.dataset.title;
    modalImgDescription.textContent = imgElement.alt;
    modalImg.show();
}

//Function to close the modal img
function closeModal(modal, isForm = null) {
    modal.classList.add("closing");
    setTimeout(() => {
        modal.close()
        modal.classList.remove("closing");
        if (isForm) { 
            modalForm.reset();
            fileText.textContent = "Selecciona tu Fotografía";
            fileInputContainer.ariaLabel = "Selecciona tu Fotografía";
        }else{
            let imageShowed = document.querySelector(".main__item[data-showing = 'true']");
            if (imageShowed) { imageShowed.removeAttribute("data-showing"); }
        }
    }, 450);
}

//Function to remove the image from the DOM
function removeImage(e) {
    Swal.fire({
        title: "¿Deseas eliminar la imagen de la Galería?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: `No eliminar`,
        cancelButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector(".main__item[data-showing = 'true']").remove();
            Swal.fire({
                title: "Imagen Eliminada",
                text: "La imagen ha sido eliminada de la Galería",
                icon: "success"
            });
            closeModal(modalImg);
            //Reload the images with the filter value selected
            filterImages(null, filterSelect.value);
        }
    });
}

//*Functions for the modal upload

//Function to open the file input
function openFileInput(e) {
    if (e.keyCode && (e.keyCode !== 13)) { return; };
    fileInput.click();
}

//Function to change the text of the label when something is selected in the file input
function handleFileText(e) {
    fileText.textContent = e.target.files[0].name;
    fileInputContainer.ariaLabel = "La imagen seleccionada es: " + e.target.files[0].name;
}

//Function to update the character counter
function updateCharacterCounter(e) {
    counterText.textContent = `Contador de Caracteres: ${e.target.value.length}/100`;
}

//Function to handle the form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (fileInput.files.length === 0 || imageNameInput.value === "" || imageDescriptionInput.value === "" || imageCategorieInput.value === "") {
        Swal.fire({
            title: "Error",
            text: "Asegurate de llenar todos los campos",
            icon: "error"
        });
    }

    //Obtaining the image url
    let imgUrl = URL.createObjectURL(fileInput.files[0]);
    //Create a new Image Object
    let img = new Image();
    //Set the src of the Image object to the image 
    img.src = imgUrl;

    //Wait for the image load
    img.onload = () => {
        //Get the width and height of the image
        const width = img.width;
        const height = img.height;
        let imgClass = "";

        //Make comparisions to return a class or another
        if (width >= 1280 & height >= 1280) {
            imgClass = "large";
        }else if (width > height) {
            imgClass = "wide";
        }else if (width < height) {
            imgClass = "tall";
        }

        //Creating the grid item
        let gridItem = document.createElement("article");
        gridItem.classList.add("main__item");
        if (imgClass !== "") { gridItem.classList.add(imgClass) }
        gridItem.innerHTML = `<figure class="main__item-figure">
                                <img src="${imgUrl}" alt="${imageDescriptionInput.value}" class="main__img" data-filter="${imageCategorieInput.value}" data-title="${imageNameInput.value}" loading="lazy" onclick="openModalImg(this)">
                            </figure>`;
        grid.appendChild(gridItem);

        Swal.fire({
            title: "Imagen subida",
            text: "La imagen se ha subido correctamente",
            icon: "success"
        });
        closeModal(modalUpload, true);
    }

    //If the image fails to load
    img.onerror = () => {
        Swal.fire({
            title: "Error",
            text: "La imagen no se ha podido subir",
            icon: "error"
        });
    }
}