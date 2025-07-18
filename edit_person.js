// ✅ Get query parameter from URL (e.g., ?id=123)
function getQueryParam(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

const oldId = getQueryParam("id"); // The original serial number from URL

// ✅ Form fields
const serialField = document.getElementById("serial");
const name = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const address = document.getElementById("address");
const form = document.getElementById("editPersonForm");

// ✅ Load person data from backend
async function loadPerson() {
  try {
    const BASE_URL = "https://finance-buddy-backend.onrender.com/api/person"; // Change to your deployed backend URL when ready

    const res = await fetch(`${BASE_URL}/api/person`);
    const people = await res.json();

    const person = people.find(p => p.id === oldId);

    if (!person) {
      alert("❌ Person not found!");
      window.location.href = "4view_people.html";
    } else {
      // Pre-fill form fields
      serialField.value = person.id;
      name.value = person.name;
      phone.value = person.phone;
      email.value = person.email;
      address.value = person.address;
    }
  } catch (err) {
    console.error("❌ Failed to load person:", err);
    alert("Error loading person details.");
  }
}

loadPerson();

// ✅ Handle form submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const newId = serialField.value.trim();

  try {
    const BASE_URL = "https://finance-buddy-backend.onrender.com/api/person";

    // Fetch all people to check for duplicate ID
    const res = await fetch(`${BASE_URL}/api/person`);
    const people = await res.json();

    // If user changed ID, check if it already exists
    if (newId !== oldId && people.some(p => p.id === newId)) {
      alert("❌ Serial number already exists!");
      return;
    }

    // ✅ Send PUT request to update person info
    const updatedPerson = {
      id: newId,
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      address: address.value.trim()
    };

    const updateRes = await fetch(`${BASE_URL}/api/person/${oldId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPerson)
    });

    if (!updateRes.ok) {
      alert("❌ Failed to update person.");
      return;
    }

    alert("✅ Person details updated!");
    window.location.href = `5view_person.html?id=${newId}`;
  } catch (err) {
    console.error("❌ Update error:", err);
    alert("Something went wrong while updating.");
  }
});
