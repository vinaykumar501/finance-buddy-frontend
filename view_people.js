const tbody = document.getElementById("peopleTable"); // Table body to display people

// ✅ Load people from MongoDB via backend API
async function loadPeople() {
  try {
    // 👉 Change this to your deployed backend URL later
    const res = await fetch("https://finance-buddy-backend.onrender.com/api/person");

    if (!res.ok) throw new Error("Failed to fetch people");

    const people = await res.json(); // Get array of people

    // Loop through people and create rows
    people.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.phone}</td>
        <td>
          <a href="5view_person.html?id=${encodeURIComponent(p.id)}">🔍 View</a>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("❌ Error loading people:", err);
    tbody.innerHTML = `<tr><td colspan="4">Failed to load people.</td></tr>`;
  }
}

// ✅ Call it on page load
loadPeople();
