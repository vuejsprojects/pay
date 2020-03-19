import { IMAGES } from './settings.js';


const loadImage = function (img) {
    return new  Promise(resolve => {
        const image = new Image();
        image.setAttribute('id', img.id) 
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = img.src;
    });
}

const getImagePromises = function() {
    const imagePromises = [];
    for (let i=0; i < IMAGES.length; i++) {
        imagePromises.push(loadImage(IMAGES[i]));
    }
    return imagePromises;
}

const attachImagesToDiv = function( images) {
    const imagesDiv = document.getElementById('images');
    for (let i=0; i < images.length; i++) {
        imagesDiv.appendChild(images[i]); 
    }
}

export {getImagePromises, attachImagesToDiv};