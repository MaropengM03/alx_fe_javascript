// Default quotes array with categories
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// Restore last selected filter from localStorage
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// Populate categories into dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  // Reset dropdown (keep "All Categories")
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selection
  categoryFilter.value = lastSelectedCategory;
}

// Display quotes
function displayQuotes(filteredQuotes) {
  const container = document.getElementById("quoteContainer");
  container.innerHTML = "";

  filteredQuotes.forEach(quote => {
    const div = document.createElement("div");
    div.innerHTML = `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
    container.appendChild(div);
  });
}

// Filter quotes by category
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  lastSelectedCategory = category;
  localStorage.setItem("selectedCategory", category);

  let filtered = quotes;
  if (category !== "all") {
    filtered = quotes.filter(q => q.category === category);
  }

  displayQuotes(filtered);
}

// Add new quote
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuotes();

    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Initialize on page load
window.onload = () => {
  populateCategories();
  filterQuotes();
};

