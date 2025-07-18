// ✅ Get the transaction form element
const form = document.getElementById("addTransactionForm");

// ✅ Handle form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent page reload

  // ✅ Create transaction object using form input values
  const transaction = {
    personId: document.getElementById("serialNumber").value.trim(),
    amount: parseFloat(document.getElementById("amount").value),
    type: document.getElementById("type").value,
    reason: document.getElementById("reason").value,
    date: document.getElementById("date").value
  };

  // ✅ Send to backend using fetch
  try {
    const response = await fetch("https://finance-buddy-backend.onrender.com/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(transaction)
    });

    if (!response.ok) {
      const err = await response.json();
      alert(`❌ Failed to save: ${err.error || "Unknown error"}`);
      return;
    }

    // ✅ Success
    alert("✅ Transaction added to MongoDB!");
    form.reset();
  } catch (err) {
    alert("❌ Error connecting to backend.");
    console.error(err);
  }
});
