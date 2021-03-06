var player;
var pauseTime;
var frameRate;

document.addEventListener("DOMContentLoaded", () => {
  // This code loads the IFrame Player API code asynchronously
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

function loadVideo() {
  let videoID;
  try {
    let videoUrl = new URL(document.getElementById('video-link').value);
    videoID = videoUrl.searchParams.get('v');
  } catch (e) {
    console.log(e);
    document.getElementById('video-link').setCustomValidity('Please enter a valid YouTube URL.');
    document.getElementById('video-link').reportValidity();
  }
  player = new YT.Player('player', {
    height: '315',
    width: '560',
    videoId: videoID,
    events: {
      'onStateChange': updatePauseTime
    }
  });
  document.getElementById('loaded').style.display = 'block';
}

function updatePauseTime(event) {
  if (event.data == YT.PlayerState.PAUSED) {
    pauseTime = player.getCurrentTime();
  }
}

function calibrate() {
  let currentTime = player.getCurrentTime();
  frameRate = Math.round(1 / (currentTime - pauseTime));
  document.getElementById('displayFPS').innerHTML = frameRate.toString();
}

// Everything below here is bound to change
function compute() {

    // Initiate basic time variables
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let milliseconds = 0;

    // Get framerate, start frame, and end frame from corresponding elements
    // Double check they all have a value
    let frameRate = parseInt(document.getElementById('framerate').value);
    let startFrame = document.getElementById('startobj').value;
    let endFrame = document.getElementById('endobj').value;
    if (typeof (startFrame) === 'undefined' || endFrame === 'undefined' || framerate === 'undefined') {
        return
    };

    // Calculate framerate
    let frames = (endFrame - startFrame) * frameRate;
    seconds = Math.floor(frames / frameRate);
    frames = frames % frameRate;
    milliseconds = Math.round(frames / frameRate * 1000);
    if (milliseconds < 10) {
        milliseconds = '00' + milliseconds;
    } else if (milliseconds < 100) {
        milliseconds = '0' + milliseconds;
    }
    if (seconds >= 60) {
        minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
    }
    if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
    }

    // Show the time and mod message in the DOM
    let finalTime = hours.toString() + 'h ' + minutes.toString() + 'm ' + seconds.toString() + 's ' + milliseconds.toString() + 'ms';
    let modMessage = `Mod Message: Time starts at ${parseFloat(startFrame).toFixed(3)} and ends at ${parseFloat(endFrame).toFixed(3)} at ${frameRate} fps to get a final time of ${finalTime}.`;
    let credits = `Retimed using [yt-frame-timer](https://mattbraddock.com/yt-frame-timer)`;
    document.getElementById('time').value = finalTime;
    document.getElementById('postModMessage').innerHTML = "The mod message has been copied to clipboard! Please paste the it into the comment of the run you are verifying.";
    document.getElementById('modMessage').innerHTML = modMessage + ' ' + credits;

    // Copy mod message to clipboard
    navigator.clipboard.writeText(modMessage)
        .then(() => { alert(`Copied to clipboard!`) })
        .catch((error) => { alert(`Copy failed! ${error}`) })
}

const validateFPS = (event) => {
    // If framerate is invalid, show an error message and disable start and end frame fields
    if (event.target.value === '' || parseInt(event.target.value) <= 0 || isNaN(parseInt(event.target.value))) {
        document.getElementById('framerate').setCustomValidity('Please enter a valid framerate.');
        document.getElementById('framerate').reportValidity();
        document.getElementById('startobj').disabled = true;
        document.getElementById('endobj').disabled = true;
        document.getElementById('computeButton').disabled = true;
    } else {
        document.getElementById('startobj').disabled = false;
        document.getElementById('endobj').disabled = false;
        document.getElementById('computeButton').disabled = false;
    }
}

const parseForTime = (event) => {
    // Get current frame from input field (either start time or end time)
    let frameFromInputText = (JSON.parse(event.target.value)).lct;
    if (typeof frameFromInputText !== 'undefined') {
        // Get the framerate
        let frameRate = parseInt(document.getElementById('framerate').value);
        // Calculate the frame
        let frameFromObj = (time, fps) => Math.floor(time * fps) / fps; //round to the nearest frame
        let finalFrame = frameFromObj(frameFromInputText, frameRate);
        // Update the DOM
        document.getElementById(event.target.id).value = `${finalFrame}`;
    }
}
