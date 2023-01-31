const addPlaylist = document.querySelector('#addPlaylist');
const allTracks = document.querySelector('#allTracks');
const favourites = document.querySelector('#favourites');
const ownPlaylists = document.querySelector('#ownPlaylists');
const currentPlaylist = document.querySelector('#tracks');
const albumName = document.querySelector('#albumName');
const author = document.querySelector('#songAuthor');
const cover = document.querySelector('.cover');
const addToFavourites = document.querySelector('#addToFavourites');
const playlists = document.querySelector('#playlist')
const playlistHeader = document.querySelector('#mainList');
const insertToPlaylist = document.querySelector('#addToPlaylist');
const playlistSelector = document.querySelector('.selector');
const notification = document.querySelector('#notification');
//copy of selected playlist 
let playingNow = [];

//DOM creating div for one Song of a selected playlist
function renderTracks(tracks) {
  for (let i = 0; i < tracks.length; i++) {

    const newSong = document.createElement('div');
    newSong.className = 'song';
    const left = document.createElement('div');
    left.className = 'left';
    const right = document.createElement('p');
    right.className = 'right';
    const number = document.createElement('p');
    number.className = 'order';
    const title = document.createElement('p');
    title.className = 'title';
    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.className = 'removeSong'

    number.textContent = i + 1;
    title.textContent = tracks[i].title;
    right.textContent = formatTime(tracks[i].duration);

    left.appendChild(number);
    left.appendChild(title);

    newSong.appendChild(left);
    newSong.appendChild(right);
    newSong.setAttribute('data-path', tracks[i].url.replace(/C:\\Users\\tomas\\Music\\/g, '/'));
    newSong.setAttribute('data-track_id',(tracks[i].id))
    newSong.setAttribute('data-active', 'off');
    if(tracks[i].playlist_id != 1) {
      newSong.appendChild(removeButton);
    };
    currentPlaylist.appendChild(newSong);
  };
}
//fetching tracks from playlist
function getPlaylist(id) {
  fetch(`/playlist-tracks/${id}`)
    .then(res => res.json())
    .then(playlist => {
      playingNow = playlist;
      renderTracks(playlist);
    })
    .catch(e => notification.textContent = e );
};

function removePlaylist(id){
  fetch(`/playlists/${id}`,{
    method: 'DELETE'
  })
  .then(res =>res.json())
  .then(data => {
    notification.textContent = data.message;
  })
  .catch(e => notification.textContent = e );
};

playlists.addEventListener('click', (e) => {
  if(e.target.className == 'deletePlaylist'){
    const title = e.target.previousElementSibling;
    const id = title.getAttribute('data-playlist_id');
    let wantToRemove = confirm(`Do yo want to delete playlist ${title.textContent}?`);
    if (!wantToRemove) return;
    removePlaylist(id);
    ownPlaylists.innerHTML = '';
    playlistSelector.innerHTML = '';
    fetchPlaylists();
    return;
  };
  if(!e.target.getAttribute('data-playlist_id')) return;
  currentPlaylist.innerHTML = '';
  const id = (e.target).getAttribute('data-playlist_id');
  getPlaylist(id);
  turnOff(playlists.children, 'data-activeplaylist')
  turnOff(ownPlaylists.children, 'data-activeplaylist')
  e.target.parentNode.setAttribute('data-activeplaylist', 'on');
});

function turnOff(array,attribute) {
  for (let i = 0; i < array.length; i++) {
    array[i].setAttribute(attribute, 'off');
  }
};

function removeSong(playlistId,trackId){
  fetch(`/playlist-tracks/${playlistId}/${trackId}`,{
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    notification.textContent = data.message;
  })
  .catch(e => notification.textContent = e );}



currentPlaylist.addEventListener('dblclick', (e) => {
  if(e.target.classname == 'right') return;
  const song = e.target.parentNode.parentNode;
  const songPath = song.getAttribute('data-path');
  const id = parseInt((e.target.previousElementSibling).innerText) - 1;
  audio.src = songPath;
  audio.play();
  playBtn.style.backgroundImage = 'url(./assets/pause.svg)';
  albumName.textContent = playingNow[id].album;
  author.textContent = playingNow[id].artist[0];
  let srcString = '';
  const goThrough = playingNow[id].picture[0].data.data;
    for(let i =0; i< goThrough.length; i++) {
      srcString += String.fromCharCode(goThrough[i])
    };
  cover.src = `data:img:${playingNow[id].picture[0].format};base64,${window.btoa(srcString)}`;
  turnOff(currentPlaylist.children,'data-active')
  song.setAttribute('data-active', 'on');
})

currentPlaylist.addEventListener('click',(e) => {
  if(e.target.className == 'removeSong') {
    const activeplaylist = document.querySelector('[data-activeplaylist="on"]');
    const activeplaylistId = activeplaylist.children[0].getAttribute('data-playlist_id');
    const trackId = e.target.parentNode.getAttribute('data-track_id');
    removeSong(activeplaylistId,trackId);
    currentPlaylist.removeChild(e.target.parentNode);
    return;
  };
})

function resetTables() {
  fetch('/reset')
    .then(data => data.json())
    .catch(err => {
      console.error(err);
      return;
    });
};

function updateDb() {
  fetch('/create')
    .then(data => data.json())
    .catch(err => {
      console.error(err);
      return;
    })
  console.log('All Tracks updated.')
}

function resetAllTracks() {
    resetTables();
    updateDb();
};

function addToPlaylist(id, currentSong) {
  let status = '';
  fetch(`/playlist-tracks/${id}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(currentSong)
  })
  .then(data => {
    status = data.status;
    return data.json();
  })
  .then(result => {
    if (status == 405) {
      notification.textContent = result.message ;
    }
    else{
      notification.textContent = result.message;
    };
  })
  .catch(e => notification.textContent = e );
};

addToFavourites.addEventListener('click', (e) => {
  const currentSong = document.querySelector(`[data-active = 'on']`);
  const pathOfCurrentSong = currentSong.getAttribute('data-path').replace('/','\\');
  const song = {
    path: pathOfCurrentSong
  };
  addToPlaylist(2, song);
});

function createPlaylist(title) {
  let status = '';
  fetch('/playlists', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(title)
  })
  .then(data => {
    status = data.status;
    return data.json();
  })
  .then(result => {
    if (status == 405) {
      notification.textContent = result.message;
    }
    else{
      notification.textContent = result.message;
    };
  })
  .catch(e => notification.textContent = e );
};

function renderPlaylist(list) {
  for(let i = 0; i< list.length; i++) {
    let newPlaylist = document.createElement('div');
    newPlaylist.className = 'list';
    const playlistName = document.createElement('p');
    playlistName.textContent = list[i].title;
    playlistName.setAttribute('data-playlist_id', list[i].id);
    const deleteButton = document.createElement('button');
    deleteButton.className = 'deletePlaylist';
    deleteButton.textContent = 'x';
    newPlaylist.appendChild(playlistName);
    newPlaylist.appendChild(deleteButton);
    ownPlaylists.appendChild(newPlaylist);

    let pTag = document.createElement('p');
    pTag.textContent = list[i].title;
    pTag.setAttribute('data-playlist_id', list[i].id);
    playlistSelector.appendChild(pTag);
  };
};

function fetchPlaylists() {
  fetch('/playlists')
  .then(res => res.json())
  .then (list => {
    renderPlaylist(list);
  })
  .catch( e => notification.textContent = e );
};

addPlaylist.addEventListener('click', (e) => {
  let sign = window.prompt('Insert Playlist Name');
  if(!sign) {
    sign = window.prompt('Please Insert name of Playlist.')
  }
  if(sign === null)return;
  const playlist = {
    title: sign
  };
  createPlaylist(playlist);
  ownPlaylists.innerHTML = '';
  playlistSelector.innerHTML = '';
  fetchPlaylists();  
});

insertToPlaylist.addEventListener('click',(e) => {
  if(playlistSelector.classList.contains('hide')){
    playlistSelector.classList.remove('hide');
    return;
  };
  playlistSelector.classList.add('hide');
});

playlistSelector.addEventListener('click',(e) => {
  const playlistId = e.target.getAttribute('data-playlist_id');
  const currentSong = document.querySelector(`[data-active = 'on']`);
  const pathOfCurrentSong = currentSong.getAttribute('data-path').replace('/','\\');
  const song = {
    path: pathOfCurrentSong
  };
  addToPlaylist(playlistId, song);
  playlistSelector.classList.add('hide');
});

document.addEventListener('DOMContentLoaded', (e) => {
  resetAllTracks();
  fetchPlaylists();
})