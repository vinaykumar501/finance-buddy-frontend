// 👉 Global variables to store API data
let transactions = [];
let people = [];

// 👉 DOM Elements
const tbody = document.getElementById("recentTransactions");
const borrowedEl = document.getElementById("totalBorrowed");
const repaidEl = document.getElementById("totalRepaid");
const balanceEl = document.getElementById("totalBalance");
const cardContainer = document.getElementById("topBorrowerCards");
const notesBox = document.getElementById("notesBox");

// ✅ Load saved note from localStorage
const savedNote = localStorage.getItem("homeNote");
if (savedNote) notesBox.value = savedNote;

// ✅ Load data from backend (MongoDB via Express API)
async function loadData() {
  try {
    const BASE_URL = "https://finance-buddy-backend.onrender.com";

    const [txnRes, peopleRes] = await Promise.all([
      fetch(`${BASE_URL}/api/transaction`),
      fetch(`${BASE_URL}/api/person`)
    ]);

    transactions = await txnRes.json();
    people = await peopleRes.json();

    filterByRange("all"); // default filter
  } catch (err) {
    alert("❌ Failed to load data from server");
    console.error(err);
  }
}

// ✅ Call this once on page load
loadData();

// 📅 Filter dropdown event
document.getElementById("filterSelect").addEventListener("change", function () {
  const selected = this.value;
  filterByRange(selected); // Apply filter based on selection
});

// 📆 Filter transactions by date
function filterByRange(range) {
  const now = new Date();
  let filtered = [];

  if (range === "7days") {
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    filtered = transactions.filter(txn => new Date(txn.date) >= weekAgo);
  } else if (range === "thisMonth") {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    filtered = transactions.filter(txn => txn.date.startsWith(`${year}-${month}`));
  } else if (range === "lastMonth") {
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = last.getFullYear();
    const month = String(last.getMonth() + 1).padStart(2, '0');
    filtered = transactions.filter(txn => txn.date.startsWith(`${year}-${month}`));
  } else {
    filtered = transactions; // 'all' case
  }

  updateDashboard(filtered);
}

// 📊 Update Dashboard UI
function updateDashboard(data) {
  // Clear previous content
  tbody.innerHTML = "";
  cardContainer.innerHTML = "";

  // Show latest 5 transactions
 const recent = data.slice()
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);
  recent.forEach(txn => {
    const person = people.find(p => p.id == txn.personId);
    const name = person ? person.name : "Unknown";

    const row = document.createElement("tr");
    row.className = txn.type;
    row.innerHTML = `
      <td>${txn.date}</td>
      <td>${name}</td>
      <td>${txn.type.toUpperCase()}</td>
      <td>₹${txn.amount}</td>
      <td>${txn.reason}</td>`;
    tbody.appendChild(row);
  });

  // Totals
  let totalBorrowed = 0, totalRepaid = 0;
  data.forEach(txn => {
    if (txn.type === "give") totalBorrowed += txn.amount;
    else if (txn.type === "receive") totalRepaid += txn.amount;
  });

  borrowedEl.textContent = `₹${totalBorrowed.toFixed(2)}`;
  repaidEl.textContent = `₹${totalRepaid.toFixed(2)}`;
  balanceEl.textContent = `₹${(totalRepaid - totalBorrowed).toFixed(2)}`;

  // 🧮 Top 3 Borrowers
  const borrowerMap = {};
  data.forEach(txn => {
    const id = txn.personId;
    if (!borrowerMap[id]) {
      borrowerMap[id] = { give: 0, receive: 0, lastDate: txn.date };
    }
    if (txn.type === "give") borrowerMap[id].give += txn.amount;
    if (txn.type === "receive") borrowerMap[id].receive += txn.amount;

    borrowerMap[id].lastDate = txn.date > borrowerMap[id].lastDate ? txn.date : borrowerMap[id].lastDate;
  });

  const borrowerList = Object.entries(borrowerMap)
    .map(([id, entry]) => {
      const person = people.find(p => p.id == id);
      if (!person) return null;

      entry.balance = entry.receive - entry.give;
      return { id, person, ...entry };
    })
    .filter(Boolean)
    .sort((a, b) => b.give - a.give)
    .slice(0, 3); // Only top 3

  borrowerList.forEach(entry => {
    const card = document.createElement("div");
    card.className = "borrower-card";
    card.innerHTML = `
      <a href="5view_person.html?id=${entry.id}" style="text-decoration:none; color:inherit;">
        <strong>${entry.person.name}</strong><br>
        📞 ${entry.person.phone} <br>
        💰 Borrowed: ₹${entry.give.toFixed(2)}<br>
        💸 Repaid: ₹${entry.receive.toFixed(2)}<br>
        📈 Balance: <b style="color:${entry.balance < 0 ? 'red' : 'green'}">₹${entry.balance.toFixed(2)}</b><br>
        🗓️ Last Transaction: ${entry.lastDate}
      </a>
    `;
    cardContainer.appendChild(card);
  });
}

// ✅ Notes Feature (local-only)
function saveNote() {
  const note = notesBox.value.trim();
  if (note) {
    localStorage.setItem("homeNote", note);
    alert("📝 Note saved!");
  } else {
    alert("⚠️ Note is empty.");
  }
}

function editNote() {
  notesBox.focus();
}

function deleteNote() {
  if (confirm("❌ Are you sure you want to delete this note?")) {
    localStorage.removeItem("homeNote");
    notesBox.value = "";
    alert("🗑️ Note deleted.");
  }
}
