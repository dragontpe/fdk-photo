/*
 * Gallery configuration
 *
 * Add photos: place images in /images/ and add entries below.
 * Set tall: true for portrait-orientation images that should span 2 rows in the grid.
 */
const photos = [
  { src: 'images/01.jpg', caption: 'Taipei', tall: true },
  { src: 'images/02.jpg', caption: 'Taipei', tall: true },
  { src: 'images/03.jpg', caption: 'Taipei' },
  { src: 'images/04.jpg', caption: 'Taipei' },
  { src: 'images/05.jpg', caption: 'Taipei' },
];

let current = 0;
let viewMode = 'grid'; // 'grid' or 'single'

const grid = document.getElementById('grid');
const singleView = document.getElementById('singleView');
const singleImg = document.getElementById('singleImg');
const galleryControls = document.getElementById('galleryControls');
const caption = document.getElementById('caption');
const prevLink = document.getElementById('prevLink');
const nextLink = document.getElementById('nextLink');
const thumbsLink = document.getElementById('thumbsLink');

// ── Build grid ──
function buildGrid() {
  grid.innerHTML = '';
  photos.forEach(function (photo, i) {
    const item = document.createElement('div');
    item.className = 'grid-item' + (photo.tall ? ' tall' : '');
    item.addEventListener('click', function () {
      showSingle(i);
    });

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.caption || '';
    img.loading = 'lazy';

    item.appendChild(img);
    grid.appendChild(item);
  });
}

// ── Switch to grid view ──
function showGrid() {
  viewMode = 'grid';
  grid.classList.remove('hidden');
  singleView.classList.add('hidden');
  galleryControls.classList.add('hidden');
  document.body.classList.remove('single-active');
  document.body.style.overflow = '';
}

// ── Switch to single image view ──
function showSingle(index) {
  viewMode = 'single';
  current = ((index % photos.length) + photos.length) % photos.length;

  const photo = photos[current];
  singleImg.src = photo.src;
  singleImg.alt = photo.caption || '';
  caption.textContent = photo.caption || '';

  grid.classList.add('hidden');
  singleView.classList.remove('hidden');
  galleryControls.classList.remove('hidden');
  document.body.classList.add('single-active');
  document.body.style.overflow = 'hidden';

  // Preload adjacent
  preload(current + 1);
  preload(current - 1);
}

function nextPhoto() {
  showSingle(current + 1);
}

function prevPhoto() {
  showSingle(current - 1);
}

function preload(index) {
  const idx = ((index % photos.length) + photos.length) % photos.length;
  if (idx >= 0 && idx < photos.length) {
    const img = new Image();
    img.src = photos[idx].src;
  }
}

// ── Event listeners ──
prevLink.addEventListener('click', function (e) {
  e.preventDefault();
  prevPhoto();
});

nextLink.addEventListener('click', function (e) {
  e.preventDefault();
  nextPhoto();
});

thumbsLink.addEventListener('click', function (e) {
  e.preventDefault();
  showGrid();
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
  if (viewMode !== 'single') return;

  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    nextPhoto();
  } else if (e.key === 'ArrowLeft') {
    prevPhoto();
  } else if (e.key === 'Escape') {
    showGrid();
  }
});

// Touch/swipe in single view
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function (e) {
  if (viewMode !== 'single') return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', function (e) {
  if (viewMode !== 'single') return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) nextPhoto();
    else prevPhoto();
  }
});

// ── Image protection ──
document.addEventListener('contextmenu', function (e) {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

document.addEventListener('dragstart', function (e) {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

// ── Init ──
buildGrid();
