const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const volumeSlider = document.getElementById('volumeSlider');
const trackName = document.getElementById('trackName');
const trackArtist = document.getElementById('trackArtist');
const albumImg = document.getElementById('albumImg');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playlistItems = document.getElementById('playlistItems');
const darkToggle = document.getElementById('dark-toggle');
const repeatBtn = document.getElementById('repeatBtn');
const shuffleBtn = document.getElementById('shuffleBtn');

// Sample Playlist (using working URLs)
const playlist = [
  {
    name: 'Midnight Dreams',
    artist: 'Luna Echo',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=280&h=280&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    name: 'Electric Vibes',
    artist: 'Neon Waves',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=280&h=280&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    name: 'Sunset Boulevard',
    artist: 'Golden Hour',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=280&h=280&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    name: 'Starlight',
    artist: 'Cosmic Journey',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=280&h=280&fit=crop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
];

let currentTrack = 0;
let isPlaying = false;
let repeat = 0;
let shuffle = false;

// Initialize
loadTrack(currentTrack);
renderPlaylist();

// Load track
function loadTrack(index) {
  const track = playlist[index];
  audioPlayer.src = track.url;
  trackName.textContent = track.name;
  trackArtist.textContent = track.artist;
  albumImg.src = track.image;
  progressBar.value = 0;
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  
  // Update active in playlist
  document.querySelectorAll('.playlist li').forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });
}

// Render playlist
function renderPlaylist() {
  playlistItems.innerHTML = '';
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = `${track.name} - ${track.artist}`;
    li.onclick = () => {
      currentTrack = index;
      loadTrack(currentTrack);
      playAudio();
    };
    if (index === currentTrack) li.classList.add('active');
    playlistItems.appendChild(li);
  });
}

// Play/Pause with Promise handling
playBtn.addEventListener('click', togglePlay);

function togglePlay() {
  if (isPlaying) pauseAudio();
  else playAudio();
}

function playAudio() {
  // Handle play() Promise to prevent errors
  const playPromise = audioPlayer.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      })
      .catch((error) => {
        console.error('Play error:', error);
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
      });
  }
}

function pauseAudio() {
  audioPlayer.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Skip - with pause before loading
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

function nextTrack() {
  pauseAudio();
  if (shuffle) {
    currentTrack = Math.floor(Math.random() * playlist.length);
  } else {
    currentTrack = (currentTrack + 1) % playlist.length;
  }
  loadTrack(currentTrack);
  playAudio();
}

function prevTrack() {
  pauseAudio();
  currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrack);
  playAudio();
}

// Progress bar with validation
progressBar.addEventListener('change', (e) => {
  if (audioPlayer.duration && isFinite(audioPlayer.duration)) {
    audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
  }
});

audioPlayer.addEventListener('timeupdate', () => {
  if (audioPlayer.duration && isFinite(audioPlayer.duration)) {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = percent || 0;
  }
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
  progressBar.max = 100;
});

audioPlayer.addEventListener('ended', () => {
  if (repeat === 2) {
    audioPlayer.currentTime = 0;
    playAudio();
  } else {
    nextTrack();
  }
});

// Volume
volumeSlider.addEventListener('input', (e) => {
  audioPlayer.volume = e.target.value / 100;
});

// Format time
function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Repeat button
repeatBtn.addEventListener('click', () => {
  repeat = (repeat + 1) % 3;
  repeatBtn.style.color = repeat === 0 ? '#b0b5c5' : '#16a085';
  if (repeat === 2) repeatBtn.innerHTML = '<i class="fas fa-redo"></i> 1';
  else repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
});

// Shuffle button
shuffleBtn.addEventListener('click', () => {
  shuffle = !shuffle;
  shuffleBtn.style.color = shuffle ? '#16a085' : '#b0b5c5';
});

// Dark mode
darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});
