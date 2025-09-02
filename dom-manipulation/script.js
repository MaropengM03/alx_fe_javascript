let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// === 1. Fetch from server ===
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Simulate server quotes
    return data.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// === 2. Post new quote to server ===
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// === 3. Sync quotes (server wins conflicts) ===
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: server quotes overwrite local "Server" ones
  quotes = [...serverQuotes, ...quotes.filter(q => q.category !== "Server")];

  localStorage.setItem("quotes", JSON.stringify(quotes));

  showNotification("Quotes synced with server. Server data took precedence.");
  filterQuotes();
}

// === 4. Filter quotes (random display) ===
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

// === 5. Add new quote ===
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };

    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));

    postQuoteToServer(newQuote); // simulate sending to server
    filterQuotes();

    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// === 6. Notifications ===
function showNotification(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.background = "#ffeb3b";
  notification.style.padding = "10px";
  notification.style.margin = "10px 0";
  document.body.prepend(notification);

  setTimeout(() => notification.remove(), 3000);
}

// === 7. Init ===
window.onload = () => {
  syncQuotes(); // first sync
  filterQuotes();
  setInterval(syncQuotes, 30000); // periodic sync every 30s
};




