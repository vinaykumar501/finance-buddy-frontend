const tbody = document.getElementById("allTransactionTable");

// Store global data
let transactions = [];
let people = [];

// ✅ Load transactions and people from backend
async function loadData() {
  try {
    const BASE_URL = "http://localhost:5000"; // Change when deployed

    const [txnRes, peopleRes] = await Promise.all([
      fetch(`${BASE_URL}/api/transaction`),
      fetch(`${BASE_URL}/api/person`)
    ]);

    transactions = await txnRes.json();
    people = await peopleRes.json();

    renderTable(); // Show data on screen
  } catch (err) {
    console.error("❌ Error loading transactions or people:", err);
    tbody.innerHTML = `<tr><td colspan="6">Failed to load data.</td></tr>`;
  }
}

// ✅ Render transaction table
function renderTable() {
  tbody.innerHTML = ""; // Clear old data

  transactions.forEach((txn) => {
    const person = people.find(p => p.id == txn.personId);
    const name = person ? person.name : "Unknown";

    const row = document.createElement("tr");
    row.className = txn.type;

    row.innerHTML = `
      <td>${txn.date}</td>
      <td>${name}</td>
      <td>${txn.type.toUpperCase()}</td>
      <td>₹${txn.amount}</td>
      <td>${txn.reason}</td>
      <td><button onclick="deleteTxn('${txn._id}')" style="color:red;">Delete</button></td>
    `;

    tbody.appendChild(row);
  });
}

// ✅ Delete transaction using backend API
async function deleteTxn(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    try {
      const BASE_URL = "http://localhost:5000"; // Change when deployed
      const res = await fetch(`${BASE_URL}/api/transaction/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        alert("❌ Failed to delete transaction.");
        return;
      }

      // Remove from list and refresh UI
      transactions = transactions.filter(t => t._id !== id);
      renderTable();
      alert("✅ Transaction deleted!");
    } catch (err) {
      console.error("❌ Deletion error:", err);
      alert("Failed to delete transaction.");
    }
  }
}

// ✅ Load everything on page load
loadData();
