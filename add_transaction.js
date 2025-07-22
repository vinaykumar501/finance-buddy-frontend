const form = document.getElementById("addTransactionForm");
form.addEventListener("submit", async function (e) {
  e.preventDefault(); 
  const transaction = {
    personId: document.getElementById("serialNumber").value.trim(),
    amount: parseFloat(document.getElementById("amount").value),
    type: document.getElementById("type").value,
    reason: document.getElementById("reason").value,
    date: document.getElementById("date").value
  };

  console.log("Sending transaction to backend:", transaction);

  try {
    const response = await fetch("https://finance-buddy-backend.onrender.com/api/transaction", 
      {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify(transaction)
    });

    if (!response.ok) {
      const err = await response.json();
      alert(`❌ Failed to save: ${err.error || "Unknown error"}`);
      return;
    }
    alert("✅ Transaction added to MongoDB!");
    form.reset();
  } 
  catch (err) {
    alert("❌ Error connecting to backend.");
    console.error(err);
  }
});
