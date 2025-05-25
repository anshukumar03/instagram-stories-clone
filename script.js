const storiesBar = document.getElementById('storiesBar');
const storyViewer = document.getElementById('storyViewer');
const storyImage = document.getElementById('storyImage');
const progressBar = document.getElementById('progressBar');
const prevZone = document.getElementById('prevZone');
const nextZone = document.getElementById('nextZone');
const closeBtn = document.getElementById('closeBtn');

let stories = [];
let currentIndex = 0;
let timer = null;
let progressInner = null;

fetch('assets/stories.json')
  .then(res => res.json())
  .then(data => {
    stories = data;
    renderStoriesBar();
  });

function renderStoriesBar() {
  storiesBar.innerHTML = '';
  stories.forEach((story, idx) => {
    const img = document.createElement('img');
    img.src = story.image;
    img.alt = story.username;
    img.className = 'story-thumb';
    img.addEventListener('click', () => openStory(idx));
    storiesBar.appendChild(img);
  });
}

function openStory(idx) {
  currentIndex = idx;
  showStory();
  storyViewer.style.display = 'flex';
  updateThumbSeen();
}

function showStory() {
  const story = stories[currentIndex];
  storyImage.src = story.image;
  resetProgressBar();
  startProgress();
}

function resetProgressBar() {
  progressBar.innerHTML = '';
  progressInner = document.createElement('div');
  progressInner.className = 'progress-bar-inner';
  progressBar.appendChild(progressInner);
}

function startProgress() {
  let percent = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    percent += 2;
    progressInner.style.width = percent + '%';
    if (percent >= 100) {
      clearInterval(timer);
      goNext();
    }
  }, 100); // 5 seconds total (100*50ms = 5000ms)
}

function goNext() {
  if (currentIndex < stories.length - 1) {
    currentIndex++;
    showStory();
    updateThumbSeen();
  } else {
    closeStory();
  }
}

function goPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    showStory();
    updateThumbSeen();
  }
}

function closeStory() {
  storyViewer.style.display = 'none';
  clearInterval(timer);
}

function updateThumbSeen() {
  const thumbs = document.querySelectorAll('.story-thumb');
  thumbs.forEach((thumb, idx) => {
    thumb.classList.toggle('seen', idx <= currentIndex);
  });
}

// Navigation controls
prevZone.addEventListener('click', goPrev);
nextZone.addEventListener('click', goNext);
closeBtn.addEventListener('click', closeStory);

// Optional: swipe gesture support for mobile
let startX = null;
storyViewer.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});
storyViewer.addEventListener('touchend', e => {
  if (!startX) return;
  let endX = e.changedTouches[0].clientX;
  if (endX - startX > 50) goPrev();
  else if (startX - endX > 50) goNext();
  startX = null;
});
