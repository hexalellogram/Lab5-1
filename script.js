// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// declarations for common parts of the page
const clearBtn = document.querySelector("[type='reset']");
const readBtn = document.querySelector("[type='button']");
const generateBtn = document.querySelector("[type='submit'");
const fileChooser = document.getElementById('image-input');
const submissionForm = document.getElementById('generate-meme');

// get canvas and context
const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected

  // get info about canvas
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;

  // clear canvas context
  context.clearRect(0,0,canvasWidth,canvasHeight);

  // toggle relevant buttons by disabling or enabling as needed - disable clear and read text, enable generate
  // these will be enabled again when the user clicks generate
  // disable clear button
  clearBtn.disabled = true;
  // disable read text button
  readBtn.disabled = true;
  // enable generate button
  generateBtn.disabled = false;

  // fill canvas context with black
  context.fillStyle = 'black';
  context.fillRect(0,0,canvasWidth,canvasHeight);

  // draw uploaded image onto the canvas
  let dimensions = getDimmensions(canvasWidth, canvasHeight, img.width, img.height);
  context.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
});

fileChooser.addEventListener('change', () => {
  // load image
  img.src = URL.createObjectURL(fileChooser.files[0]);

  // set alt text
  let fileName = fileChooser.files[0].name;
  img.alt = fileName;
});

submissionForm.addEventListener('submit', (evt) => {
  // prevent reloading
  evt.preventDefault();

  // get top and bottom text
  let topText = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;
  
  // draw the top and bottom text
  context.font = '40px Impact';
  context.textAlign = 'center';
  context.fillStyle = 'white';
  context.fillText(topText, canvas.width / 2, 40);
  context.fillText(bottomText, canvas.width / 2, canvas.height - 40);

  // todo toggle buttons
  generateBtn.disabled = true;
  clearBtn.disabled = false;
  readBtn.disabled = false;
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
