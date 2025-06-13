const API_KEY = 'RwB_yFyYIQ59h_1JdXMqkmsz8UZS9GvQWbgQuQfKWLU'; // Replace with your Unsplash API Key
const searchForm = document.getElementById('search-form');
const queryInput = document.getElementById('query');
const resultsDiv = document.getElementById('results');
const loading = document.getElementById('loading');
const paginationDiv = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentPage = 1;
let currentQuery = '';

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  currentQuery = queryInput.value.trim();
  if (!currentQuery) return;
  currentPage = 1;
  await searchImages();
});

async function searchImages() {
  loading.classList.remove('hidden');
  resultsDiv.innerHTML = '';

  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${currentQuery}&per_page=15&page=${currentPage}&client_id=${API_KEY}`);

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    displayImages(data.results);
    paginationDiv.classList.remove('hidden');

    prevBtn.disabled = currentPage === 1;

    if (data.results.length === 0) {
      paginationDiv.classList.add('hidden');
    }

  } catch (err) {
    resultsDiv.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
  } finally {
    loading.classList.add('hidden');
  }
}

function displayImages(photos) {
  if (photos.length === 0) {
    resultsDiv.innerHTML = '<p>No results found.</p>';
    return;
  }

  resultsDiv.innerHTML = photos.map(photo => `
    <div class="image-card">
      <a href="${photo.links.html}" target="_blank">
        <img src="${photo.urls.small}" alt="${photo.alt_description || 'Image'}">
      </a>
    </div>
  `).join('');
}

nextBtn.addEventListener('click', () => {
  currentPage++;
  searchImages();
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    searchImages();
  }
});

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');

document.addEventListener('DOMContentLoaded', () => {
  const theme = localStorage.getItem('theme') || 'light';
  setTheme(theme);
});

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.style.setProperty('--bg-color', '#121212');
    document.documentElement.style.setProperty('--text-color', '#ffffff');
    document.documentElement.style.setProperty('--button-color', '#BB86FC');
    document.documentElement.style.setProperty('--button-hover', '#3700B3');
  } else {
    document.documentElement.style.setProperty('--bg-color', '#f9f9f9');
    document.documentElement.style.setProperty('--text-color', '#000000');
    document.documentElement.style.setProperty('--button-color', '#007BFF');
    document.documentElement.style.setProperty('--button-hover', '#0056b3');
  }

  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
