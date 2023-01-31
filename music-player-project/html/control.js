//controlbar functionality

const audio = document.querySelector('audio')
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#previous');
const nextBtn = document.querySelector('#next');
const seekBar = document.querySelector('#seekbar');
let remainingTime = document.querySelector('#remainingTime');
const totalTime = document.querySelector('#totalTime');
const shuffle = document.querySelector('#shuffle');
const volume = document.querySelector('#volume');
const volumeBar = document.querySelector('#volumeBar');

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
    .filter(a => a)
    .join(':');
};

function randomSong() {
  return Math.floor(Math.random() * ((currentPlaylist.children.length - 1) - 0) + 0);
}

function nextSong() {
  const currentActive = document.querySelector("[data-active='on']");
  const nextActive = currentActive.nextElementSibling;
  const shuffleStatus = shuffle.getAttribute('data-shuffle');
  if (audio.currentTime == audio.duration) {
    if (shuffleStatus == 'on') {
      let nextRandomSong = currentPlaylist.children[randomSong()];
      audio.src = nextRandomSong.getAttribute('data-path');
      audio.play();
      turnOff(currentPlaylist.children,'data-active');
      nextRandomSong.setAttribute('data-active', 'on')
      return;
    } else {
      if (!nextActive) return;
      audio.src = nextActive.getAttribute('data-path');
      audio.play();
      turnOff(currentPlaylist.children,'data-active');
      nextActive.setAttribute('data-active', 'on');
    };
  };
};

audio.onloadedmetadata = function () {
  totalTime.textContent = formatTime(audio.duration.toFixed(0));
};

audio.addEventListener('timeupdate', (e) => {
  remainingTime.textContent = formatTime((audio.currentTime).toFixed(0));
  seekBar.value = ((audio.currentTime / audio.duration) * 100).toFixed(1);
  let curPos = seekBar.value;
  seekBar.style.background = `linear-gradient(to right, #721f1f 0%, #721f1f ${curPos}%, #c9c9c9 ${curPos}%, #c9c9c9 100%)`;
});

audio.addEventListener('ended',(e) =>{
  nextSong();
});

playBtn.addEventListener('click', (e) => {
  if (audio.paused) {
    audio.play();
    playBtn.style.backgroundImage = 'url(./assets/pause.svg)';
    return;
  };
  audio.pause();
  playBtn.style.backgroundImage = 'url(./assets/play.svg)';
});

volume.addEventListener('click', (e) => {
  if (audio.muted == false) {
    audio.muted = true;
    volume.style.backgroundImage = 'url(./assets/muted.svg)';
    return;
  };
  audio.muted = false;
  volume.style.backgroundImage = 'url(./assets/volume.svg)';
});

volumeBar.oninput = function () {
  audio.volume = volumeBar.value / 100;
  let range = volumeBar.value;
  volumeBar.style.background = `linear-gradient(to right, #721f1f 0%, #721f1f ${range}%, #c9c9c9 ${range}%, #c9c9c9 100%)`;
};

seekBar.oninput = function () {
  audio.currentTime = (audio.duration / 100) * seekBar.value;
  audio.play();
  playBtn.style.backgroundImage = 'url(./assets/pause.svg)';
};

nextBtn.addEventListener('click', (e) => {
  const currentActive = document.querySelector("[data-active='on']");
  const nextActive = currentActive.nextElementSibling;
  if (!nextActive) {
    return;
  }
  turnOff(currentPlaylist.children,'data-active');
  nextActive.setAttribute('data-active', 'on');
  audio.src = nextActive.getAttribute('data-path');
  audio.play();
  playBtn.style.backgroundImage = 'url(./assets/pause.svg)';
})

prevBtn.addEventListener('click', (e) => {
  const currentActive = document.querySelector("[data-active='on']");
  const prevActive = currentActive.previousElementSibling;
  if (!prevActive) {
    return;
  };
  turnOff(currentPlaylist.children,'data-active');
  prevActive.setAttribute('data-active', 'on');
  audio.src = prevActive.getAttribute('data-path');
  audio.play();
  playBtn.style.backgroundImage = 'url(./assets/pause.svg)';
});

shuffle.addEventListener('click', (e) => {
  const shuffleStatus = shuffle.getAttribute('data-shuffle');
  switch (shuffleStatus) {
    case 'off':
      shuffle.setAttribute('data-shuffle', 'on');
      shuffle.style.backgroundImage = "url('./assets/shuffle.svg')";
      break;
    case 'on':
      shuffle.setAttribute('data-shuffle', 'off');
      shuffle.style.backgroundImage = "url('./assets/shuffle-off.svg')"
      break;
  };
});