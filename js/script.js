import images from "./gallery-items.js";

const galleryParentRef = document.querySelector(".js-gallery");
const modalRef = document.querySelector(".lightbox");
const modalCloseBtnRef = modalRef.querySelector(
  'button[data-action="close-lightbox"]'
);

const lightboxImgRef = document.querySelector(".lightbox__image");

function renderGalleryHandler(images) {
  const imagesArray = images.map((element, index) => {
    return `<li class="gallery__item"><a class="gallery__link" href="${element.original}">
            <img
                class="gallery__image" src="${element.preview}"
                data-source="${element.original}"
                data-index="${index}"
                alt="${element.description}"
            />
        </a>
    </li>`;
  }); //data-index для навигации стрелками
  galleryParentRef.insertAdjacentHTML("beforeend", imagesArray.join(""));
}

function lightboxOpenHandler(event) {
  if (event.target.nodeName !== "IMG") return;
  const imgSource = event.target.dataset.source;
  const imgIndex = event.target.dataset.index;
  const imgAlt = event.target.alt;

  event.preventDefault();
  modalRef.classList.add("is-open");
  lightboxImgRef.src = imgSource;
  lightboxImgRef.dataset.index = imgIndex;
  lightboxImgRef.alt = imgAlt;
  window.addEventListener("keydown", lightboxKeypressHandler);
}

function lightboxCloseHandler() {
  window.removeEventListener("keydown", lightboxKeypressHandler);
  modalRef.classList.remove("is-open");
  lightboxImgRef.src = "";
}

function lightboxImageHandler(event) {
  event.stopImmediatePropagation();
}

function arrowClickHandler(indexShift) {
  const currentImgIndex = Number(lightboxImgRef.dataset.index);
  const nextImgIndex = currentImgIndex + indexShift;
  if (nextImgIndex !== -1 && nextImgIndex < galleryParentRef.children.length) {
    const nextImg = galleryParentRef.querySelector(
      `img[data-index="${nextImgIndex}"]`
    );
    lightboxImgRef.src = nextImg.dataset.source;
    lightboxImgRef.dataset.index = nextImgIndex;
    lightboxImgRef.alt = nextImg.alt;
  }
}

function lightboxKeypressHandler(event) {
  const key = event.code;
  switch (key) {
    case "Escape":
      lightboxCloseHandler();
      break;
    case "ArrowRight":
      arrowClickHandler(1);
      break;
    case "ArrowLeft":
      arrowClickHandler(-1);
      break;

    default:
      return;
  }
}

renderGalleryHandler(images);
galleryParentRef.addEventListener("click", lightboxOpenHandler);
modalRef.addEventListener("click", lightboxCloseHandler);
modalCloseBtnRef.addEventListener("click", lightboxCloseHandler); // уже не нужно, т.к. есть закрытие по клику на модальное окно?
lightboxImgRef.addEventListener("click", lightboxImageHandler); // закрываем только по клику на оверлей, но не на саму картинку?
