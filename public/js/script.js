// Client-side form validationgit add 
const form = document.getElementById("itemForm");
const itemsList = document.getElementById("itemsList");

// Fetch and display items
function fetchItems() {
  fetch("/api/items")
    .then(res => res.json())
    .then(data => {
      itemsList.innerHTML = "";
      data.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = `
  <h3>${item.title} (${item.category})</h3>
  <p>${item.description}</p>
  <p>Location: ${item.location}</p>
  <p>Date: ${item.date}</p>
  <p>Contact: ${item.contact}</p>
  <p>Status: ${item.status}</p>
  <button class="update-btn">Mark Resolved</button>
  <button class="delete-btn">Delete</button>
`;

// Add event listeners after creating buttons
div.querySelector(".update-btn").addEventListener("click", () => updateStatus(item.id));
div.querySelector(".delete-btn").addEventListener("click", () => deleteItem(item.id));
        itemsList.appendChild(div);
      });
    });
}

// Add item
form.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    alert(res.message);
    form.reset();
    fetchItems();
  });
});

// Update status
function updateStatus(id) {
  fetch(`/api/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "Resolved" })
  })
  .then(res => res.json())
  .then(res => {
    alert(res.message);
    fetchItems(); // refresh the list
  })
  .catch(err => console.error(err));
}

// Delete item
function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  fetch(`/api/items/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(res => {
    alert(res.message);
    fetchItems(); // refresh the list
  })
  .catch(err => console.error(err));
}

// Initial fetch
fetchItems();