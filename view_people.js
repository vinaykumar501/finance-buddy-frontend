// ✅ Get table body element where people will be listed
const tbody = document.getElementById("peopleTable");

// ✅ Function to load people from backend and populate the table
async function loadPeople() {
  try {
    const res = await fetch("https://finance-buddy-backend.onrender.com/api/person");

    if (!res.ok) throw new Error("❌ Failed to fetch people from backend");

    const people = await res.json(); // Get list of people from backend

    if (people.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">No people found.</td></tr>`;
      return;
    }

    // ✅ Populate each row with person data
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
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="4">❌ Error loading people from server.</td></tr>`;
  }
}

// ✅ Automatically run on page load
loadPeople();
