// --- Quotes Storage Logic ---

const LOCAL_STORAGE_KEY = 'quotes';
const SESSION_STORAGE_KEY = 'lastViewedQuote';

let quotes = loadQuotes();
const categories = new Set(quotes.map(q => q.category));
const quoteDisplay = document.getElementById('quoteDisplay');
const categorySelect = document.getElementById('categorySelect');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteFormDiv = document.getElementById('addQuoteForm');
const exportJsonBtn = document.getElementById('exportJson');
const importFileInput = document.getElementById('importFile');

// --- Storage Functions ---

function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback if corrupted
      return [];
    }
  }
  // Default quotes if not stored
  return [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", category: "Success" },
  ];
}

// --- Category Fill ---

function populateCategories() {
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  categories.clear();
  quotes.forEach(q => categories.add(q.category));
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// --- Quote Display & Session Storage ---

function showRandomQuote() {
  let selectedCategory = categorySelect.value;
  let filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    sessionStorage.setItem(SESSION_STORAGE_KEY, "");
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

function showLastViewedQuote() {
  const last = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (last) {
    try {
      const quote = JSON.parse(last);
      quoteDisplay.textContent = `"${quote.text}" — ${quote.category} (last viewed)`;
    } catch {}
  }
}

// --- Add Quote Form ---

function createAddQuoteForm() {
  addQuoteFormDiv.innerHTML = '';
  const form = document.createElement('form');
  form.onsubmit = function(e) {
    e.preventDefault();
    addQuote();
  };

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  quoteInput.required = true;

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.required = true;

  const addBtn = document.createElement('button');
  addBtn.type = 'submit';
  addBtn.textContent = 'Add Quote';

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addBtn);

  addQuoteFormDiv.appendChild(form);
}

function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  }
}

// --- Export & Import JSON ---

exportJsonBtn.addEventListener('click', function() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
});

importFileInput.addEventListener('change', importFromJsonFile);

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes.filter(q =>
          q.text && q.category && typeof q.text === 'string' && typeof q.category === 'string'
        ));
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid file format.');
      }
    } catch {
      alert('Failed to import quotes. Invalid JSON.');
    }
    importFileInput.value = ''; // reset file input
  };
  fileReader.readAsText(file);
}

// --- Event Listeners & Initialization ---

newQuoteBtn.addEventListener('click', showRandomQuote);
categorySelect.addEventListener('change', showRandomQuote);

populateCategories();
showRandomQuote();
createAddQuoteForm();

// Optionally show last viewed quote on page load
showLastViewedQuote();