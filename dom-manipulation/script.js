let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Show one random quote
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", category);

  let filtered = quotes;
  if (category !== "all") {
    filtered = quotes.filter(q => q.category === category);
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomQuote = filtered[randomIndex];

  document.getElementById("quoteDisplay").innerHTML =
    `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
}

// Sync with server (server always wins)
async function syncWithServer() {
  try {
    const res = await fetch(SERVER_URL);
    const serverData = await res.json();

    const serverQuotes = serverData.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));

    quotes = [...serverQuotes, ...quotes.filter(q => q.category !== "Server")];
    localStorage.setItem("quotes", JSON.stringify(quotes));

    filterQuotes();
  } catch (e) {
    console.error("Sync failed", e);
  }
}

// On page load
window.onload = () => {
  syncWithServer();
  filterQuotes();
  setInterval(syncWithServer, 30000); // auto sync every 30s
};



