const tbody = document.getElementById("allTransactionTable");

// Store global data
let transactions = [];
let people = [];

async function loadData() {
  try {
    const BASE_URL = "https://finance-buddy-backend.onrender.com";

    console.log("📡 Fetching from:", BASE_URL);

    const [txnRes, peopleRes] = await Promise.all([
      fetch(`${BASE_URL}/api/transaction`),
      fetch(`${BASE_URL}/api/person`)
    ]);

    if (!txnRes.ok || !peopleRes.ok) {
      throw new Error(`Status: ${txnRes.status}, ${peopleRes.status}`);
    }

    transactions = await txnRes.json();
    people = await peopleRes.json();

    console.log("✅ Transactions loaded:", transactions);
    console.log("✅ People loaded:", people);

    renderTable();
  } catch (err) {
    console.error("❌ Error loading data:", err);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">❌ Failed to load data. Check console.</td></tr>`;
  }
}

function renderTable() {
  tbody.innerHTML = "";

  if (transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No transactions found.</td></tr>`;
    return;
  }

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

async function deleteTxn(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    try {
      const BASE_URL = "https://finance-buddy-backend.onrender.com";
      const res = await fetch(`${BASE_URL}/api/transaction/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        alert("❌ Failed to delete transaction.");
        return;
      }

      transactions = transactions.filter(t => t._id !== id);
      renderTable();
      alert("✅ Transaction deleted!");
    } catch (err) {
      console.error("❌ Deletion error:", err);
      alert("Failed to delete transaction.");
    }
  }
}

// ✅ Call when page is ready
document.addEventListener("DOMContentLoaded", loadData);
