
  // ✅ Get URL query parameter (personId)
  function getQueryParam(key) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  }

  const personId = getQueryParam("id");
  document.getElementById("editLink").href = `6edit_person.html?id=${personId}`;

  // ✅ Load person and their transactions from backend
  async function loadPersonDetails() {
    try {
      const BASE_URL = "https://finance-buddy-backend.onrender.com/api/person"; // Replace with your deployed URL later

      // Fetch all people and transactions
      const [peopleRes, txnRes] = await Promise.all([
        fetch(`${BASE_URL}/api/person`),
        fetch(`${BASE_URL}/api/transaction`)
      ]);

      const people = await peopleRes.json();
      const transactions = await txnRes.json();

      // Find person and their transactions
      const person = people.find(p => p.id === personId);
      const personTransactions = transactions.filter(t => t.personId === personId);

      if (!person) {
        document.body.innerHTML = "<h2>❌ Person not found</h2>";
        return;
      }

      // 🧑 Display person info
      document.getElementById("name").textContent = person.name;
      document.getElementById("phone").textContent = person.phone;
      document.getElementById("email").textContent = person.email;
      document.getElementById("address").textContent = person.address;

      // 💰 Calculate balance
      let balance = 0;
      personTransactions.forEach(txn => {
        balance += txn.type === "receive" ? txn.amount : -txn.amount;
      });
      document.getElementById("balance").textContent = balance.toFixed(2);

      // 📄 Fill transaction table
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

  // 🗑️ Delete person and their transactions
  document.getElementById("deletePerson").addEventListener("click", async function () {
    if (confirm("Are you sure you want to delete this person and all their transactions?")) {
      try {
        const BASE_URL = "https://finance-buddy-backend.onrender.com/api/person"; // Replace when deployed

        // First: delete all transactions for this person (optional, depends on your backend)
        await fetch(`${BASE_URL}/api/transaction/person/${personId}`, { method: "DELETE" });

        // Then: delete the person
        const res = await fetch(`${BASE_URL}/api/person/${personId}`, { method: "DELETE" });

        if (!res.ok) {
          alert("❌ Failed to delete person");
          return;
        }

        alert("✅ Person and their transactions deleted successfully.");
        window.location.href = "1home.html";

      } catch (err) {
        console.error("❌ Deletion error:", err);
        alert("Error deleting person.");
      }
    }
  });


