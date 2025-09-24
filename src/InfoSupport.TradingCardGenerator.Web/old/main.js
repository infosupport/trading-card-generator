// Update player name overlay live
const playerNameOverlay = document.querySelector('.card-player-name');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
function updatePlayerName() {
  const first = firstNameInput.value.trim();
  const last = lastNameInput.value.trim();
  playerNameOverlay.textContent = (first + ' ' + last).trim().toUpperCase() || 'PLAYER NAME';
}
firstNameInput.addEventListener('input', updatePlayerName);
lastNameInput.addEventListener('input', updatePlayerName);
updatePlayerName();


// Only handle the video frame in canvas, overlays and card are HTML/CSS
const video = document.getElementById('webcam');
const canvas = document.getElementById('video-canvas');
const ctx = canvas.getContext('2d');

const CARD_WIDTH = 750;
const CARD_HEIGHT = 1050;
canvas.width = CARD_WIDTH;
canvas.height = CARD_HEIGHT;

function startWebcam() {
  navigator.mediaDevices.getUserMedia({ video: { width: CARD_WIDTH, height: CARD_HEIGHT } })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(() => alert('Could not access webcam.'));
}

// TODO Check/fix aspect ratio of video
function drawWebcamImage() {
    // return;
  const border = 0;
  const radius = 32;
  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.save();

  const areaW = CARD_WIDTH - 2 * border;
  const areaH = CARD_HEIGHT - 0 - border;

  // Draw a rounded rectangle path for the video area
  ctx.beginPath();
  roundedRect(ctx, border, border, areaW, areaH, radius);
  ctx.closePath();
  ctx.clip();

  // Aspect ratio cover logic
  const videoW = video.videoWidth;
  const videoH = video.videoHeight;
  if (videoW && videoH) {
    const areaRatio = areaW / areaH;
    const videoRatio = videoW / videoH;
    let drawW, drawH, sx, sy;
    if (videoRatio > areaRatio) {
      drawH = videoH;
      drawW = videoH * areaRatio;
      sx = (videoW - drawW) / 2;
      sy = 0;
    } else {
      drawW = videoW;
      drawH = videoW / areaRatio;
    //   console.log(drawH, areaH);
      sx = 0;
      sy = (videoH - drawH) / 2;
    }
    ctx.drawImage(video, sx, sy, drawW, drawH, border, border, areaW, areaH);
  }
  ctx.restore();
  requestAnimationFrame(drawWebcamImage);
}

// Helper to draw a rounded rectangle path
function roundedRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

video.addEventListener('play', drawWebcamImage);
startWebcam();
