// ✅ Get form and input field references
const form = document.getElementById("addPersonForm");
const serialField = document.getElementById("serial");
const name = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const address = document.getElementById("address");

// ✅ Add submit event listener to the form
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent default form submission

  // ✅ Create person object from form input
  const person = {
    id: serialField.value.trim(),
    name: name.value.trim(),
    phone: phone.value.trim(),
    email: email.value.trim(),
    address: address.value.trim()
  };

  // ✅ Send data to backend using fetch
  try {
    // Change this to your deployed backend URL when ready
   const response = await fetch("https://finance-buddy-backend.onrender.com/api/person", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(person)
});


    if (!response.ok) {
      if (response.status === 400) {
        const err = await response.json();
        alert(`❌ Error: ${err.error}`);
      } else {
        alert("❌ Failed to save person to server.");
      }
      return;
    }

    // ✅ Success
    alert("✅ Person added successfully to MongoDB!");
    form.reset();
  } catch (err) {
    alert("❌ Failed to connect to backend.");
    console.error(err);
  }
});
