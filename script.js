// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// declarations for common parts of the page
const clearBtn = document.querySelector("[type='reset']");
const readBtn = document.querySelector("[type='button']");
const generateBtn = document.querySelector("[type='submit'");
const fileChooser = document.getElementById('image-input');
const submissionForm = document.getElementById('generate-meme');
const voiceSelect = document.getElementById('voice-selection');
const volumeGroup = document.getElementById('volume-group');

// get canvas and context
const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');

// declaration for speech synthesis
const synth = window.speechSynthesis;
let voices = [];
let volumeLevel = document.querySelector("[type='range']").value / 100;

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

// fires when file is chosen
fileChooser.addEventListener('change', () => {
  // load image
  img.src = URL.createObjectURL(fileChooser.files[0]);

  // set alt text
  let fileName = fileChooser.files[0].name;
  img.alt = fileName;
});

// when submission button clicked
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

  // toggle buttons
  generateBtn.disabled = true;
  clearBtn.disabled = false;
  readBtn.disabled = false;
});

// when the clear button is clicked, clear out the meme
clearBtn.addEventListener('click', () => {
  context.clearRect(0,0,canvas.width,canvas.height);

  // toggle buttons
  generateBtn.disabled = false;
  clearBtn.disabled = true;
  readBtn.disabled = true;

});

// when the read button is clicked, read out the text
readBtn.addEventListener('click', () => {
  // get top and bottom text and combine into one
  let topText = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;
  let combinedText = topText + ' ' + bottomText;

  // get speech details
  let utterThis = new SpeechSynthesisUtterance(combinedText);
  utterThis.voice = voices[voiceSelect.selectedOptions[0].getAttribute('voices-idx')];
  utterThis.volume = volumeLevel;
  synth.speak(utterThis);
});

// populate voices list - code taken from https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis example
function populateVoiceList() {
  voices = synth.getVoices();

  // remove placeholder "No available voice options"
  voiceSelect.remove(0);
  for(let i = 0; i < voices.length ; i++) {
    // console.log(voices[i].name);
    let option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    option.setAttribute('voices-idx', i);
    voiceSelect.appendChild(option);
  }
  voiceSelect.disabled = false;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// if any input into the volume group, this triggers
volumeGroup.addEventListener('input', () => {
  // set new volume level, normalized to 0-1
  let intVol = document.querySelector("[type='range']").value;
  volumeLevel = intVol / 100;

  // change the volume icons
  let volumeIcon = document.querySelectorAll('img')[0];
  if (intVol == 0) {
    volumeIcon.src = 'icons/volume-level-0.svg';
  }
  else if (intVol <= 33) {
    volumeIcon.src = 'icons/volume-level-1.svg';
  }
  else if (intVol <= 66) {
    volumeIcon.src = 'icons/volume-level-2.svg';
  }
  else {
    volumeIcon.src = 'icons/volume-level-3.svg';
  }
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
