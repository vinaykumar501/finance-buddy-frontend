function getQueryParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

const personId = getQueryParam("id");
document.getElementById("editLink").href = `6edit_person.html?id=${personId}`;

async function loadPersonDetails() {
  try {
    const BASE_URL = "https://finance-buddy-backend.onrender.com";

    const [peopleRes, txnRes] = await Promise.all([
      fetch(`${BASE_URL}/api/person`),
      fetch(`${BASE_URL}/api/transaction`)
    ]);

    const people = await peopleRes.json();
    const transactions = await txnRes.json();

    const person = people.find(p => p.id === personId);
    const personTransactions = transactions.filter(t => t.personId === personId);

    if (!person) {
      document.body.innerHTML = "<h2>❌ Person not found</h2>";
      return;
    }

    document.getElementById("name").textContent = person.name;
    document.getElementById("phone").textContent = person.phone;
    document.getElementById("email").textContent = person.email;
    document.getElementById("address").textContent = person.address;

    let balance = 0;
    personTransactions.forEach(txn => {
      balance += txn.type === "receive" ? txn.amount : -txn.amount;
    });
    document.getElementById("balance").textContent = balance.toFixed(2);

    const tbody = document.querySelector("#transactionTable tbody");
    personTransactions.forEach(txn => {
      const row = document.createElement("tr");
      row.className = txn.type;
      row.innerHTML = `
        <td>${txn.date}</td>
        <td class="${txn.type}">${txn.type.toUpperCase()}</td>
        <td>₹${txn.amount}</td>
        <td>${txn.reason}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("❌ Error loading person data:", err);
    alert("Failed to load person details.");
  }
}

loadPersonDetails();

document.getElementById("deletePerson").addEventListener("click", async function () {
  if (confirm("Are you sure you want to delete this person and all their transactions?")) {
    try {
      const BASE_URL = "https://finance-buddy-backend.onrender.com";

      await fetch(`${BASE_URL}/api/transaction/person/${personId}`, { method: "DELETE" });

      const res = await fetch(`${BASE_URL}/api/person/${personId}`, { method: "DELETE" });

      if (!res.ok) {
        alert("❌ Failed to delete person.");
        return;
      }

      alert("✅ Person and their transactions deleted successfully.");
      window.location.href = "4view_people.html";

    } catch (err) {
      console.error("❌ Deletion error:", err);
      alert("Error deleting person.");
    }
  }
});
