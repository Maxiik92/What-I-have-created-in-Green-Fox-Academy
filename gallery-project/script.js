//setting the variables
const buttonLeft = document.getElementById("buttonLeft");
const buttonRight = document.getElementById("buttonRight");
let previewImage = document.getElementById("bigIMG");
let thumbnails = document.getElementById("thumbnails");
let img = document.getElementById("bigIMG");

//creating thumbnails
for (let i = 0; i < gallery.length; i++) {
  let newImg = document.createElement("img");
  newImg.setAttribute("src", gallery[i].src);
  newImg.setAttribute("title", gallery[i].title);
  newImg.setAttribute("alt", gallery[i].description);
  newImg.onclick = function (e) {
    change(e, this.src, this.title, this.alt);
    backgroundChanger();
  }
  thumbnails.appendChild(newImg);
}
//set first picture as default active
thumbnails.firstElementChild.className = "active";

//creating the preview
let activeImg = document.getElementsByClassName("active")[0];
let imgTitle = document.getElementById("titleOfImg");
let imgDescript = document.getElementById("description");
img.setAttribute("src", activeImg.getAttribute("src"));
imgTitle.textContent = activeImg.getAttribute("title");
imgDescript.textContent = activeImg.getAttribute("alt");

//creating a function that changes active class onClick, changing the preview img
const change = (newImg, src, title, alt) => {
  document.getElementById("bigIMG").src = src;
  imgTitle.textContent = title;
  imgDescript.textContent = alt;
  Array.from(thumbnails.children).filter(element => element.className === "active").map(element => element.className = "");
  newImg.currentTarget.className = "active";
}

//button functions
function rightButton() {
  let currentActive = document.getElementsByClassName("active")[0];
  let nextActive = currentActive.nextElementSibling;
  let firstThumbnail = document.getElementById("thumbnails").firstElementChild;
  if (!nextActive) {
    currentActive.className = "";
    firstThumbnail.className = "active";
    imgTitle.textContent = firstThumbnail.getAttribute("title");
    imgDescript.textContent = firstThumbnail.getAttribute("alt");
    previewImage.setAttribute("src", firstThumbnail.getAttribute("src"))
  } else {
    currentActive.nextElementSibling.className = "active";
    currentActive.className = "";
    imgTitle.textContent = currentActive.nextElementSibling.getAttribute("title");
    imgDescript.textContent = currentActive.nextElementSibling.getAttribute("alt");
    previewImage.setAttribute("src", currentActive.nextElementSibling.getAttribute("src"));
  }
}

function leftButton() {
  let currentActive = document.getElementsByClassName("active")[0];
  let previousActive = currentActive.previousElementSibling;
  let lastThumbnail = document.getElementById("thumbnails").lastElementChild;
  if (!previousActive) {
    currentActive.className = "";
    lastThumbnail.className = "active";
    imgTitle.textContent = lastThumbnail.getAttribute("title");
    imgDescript.textContent = lastThumbnail.getAttribute("alt");
    previewImage.setAttribute("src", lastThumbnail.getAttribute("src"));
  } else {
    currentActive.previousElementSibling.className = "active";
    currentActive.className = "";
    previewImage.setAttribute("src", currentActive.previousElementSibling.getAttribute("src"));
    imgTitle.textContent = currentActive.previousElementSibling.getAttribute("title");
    imgDescript.textContent = currentActive.previousElementSibling.getAttribute("alt");
  }
}

//button functions callback on click, backgroundChanger() is changing the color of background 
//stored at "./background-changer.js"
buttonRight.onclick = function () {
  rightButton();
  backgroundChanger();
}

buttonLeft.onclick = function () {
  leftButton();
  backgroundChanger();
}

// enabling to move pictures with left and right arrows
function keyPress(event) {
  switch (event.keyCode) {
    case 37:
      leftButton();
      backgroundChanger();
      break;
    case 39:
      rightButton();
      backgroundChanger();
      break;
  }
}

document.body.addEventListener("keydown", keyPress);