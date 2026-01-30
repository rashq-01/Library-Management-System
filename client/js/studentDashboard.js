import {PORT,HOST} from "./HOST.js";
// DOM Elements
const dashboardSidebar = document.getElementById("dashboardSidebar");
const mobileToggle = document.getElementById("mobileToggle");
const menuItems = document.querySelectorAll(".menu-item");
const currentDateElement = document.getElementById("currentDate");
const bookCardsContainer = document.getElementById("bookCardsContainer");
const issuedBooksTable = document.getElementById("issuedBooksTable");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const authorFilter = document.getElementById("authorFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const issueNewBookBtn = document.getElementById("issueNewBook");
let issuedBooks = [];
let response = null;
let books = [];

const token = localStorage.getItem("token");
if (!token) {
  alert("Unauthorized. Please login again.");
  window.location.href = "/pages/login.html";
}

// Set current date
function updateCurrentDate() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  currentDateElement.textContent = now.toLocaleDateString("en-US", options);
}

// Tab navigation
menuItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active class from all menu items
    menuItems.forEach((i) => i.classList.remove("active"));
    // Add active class to clicked item
    this.classList.add("active");

    // Get tab to show
    const tabToShow = this.getAttribute("data-tab");

    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.remove("active");
    });

    // Show selected tab
    document.getElementById(`${tabToShow}Tab`).classList.add("active");

    // If switching to search tab, load books
    if (tabToShow === "searchBook") {
      loadBooks();
    }

    // If switching to my books tab, load issued books
    if (tabToShow === "myBooks") {
      loadIssuedBooks();
    }

    // On mobile, close sidebar after clicking
    if (window.innerWidth <= 992) {
      dashboardSidebar.classList.remove("active");
    }
  });
});

// Mobile sidebar toggle
mobileToggle.addEventListener("click", () => {
  dashboardSidebar.classList.toggle("active");
});

// Load books into the search page
async function loadBooks(filteredBooks) {
  try {
    if (!filteredBooks) {
      const response = await fetch(`http://${HOST}:${PORT}/api/getBook`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 401) {
        alert(response.json().message);
        localStorage.removeItem("token");
        window.location.href = "/pages/login.html";
        return;
      }

      const data = await response.json();
      if (!data.success) {
        alert(data.message);
        return;
      }
      books = data.BOOKs;
      filteredBooks = books;
    }

    bookCardsContainer.innerHTML = "";

    if (filteredBooks.length === 0) {
      bookCardsContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--dark-gray);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No books found</h3>
                    <p>Try adjusting your search or filters</p>
                    </div>
                    `;
      return;
    }

    filteredBooks.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";

      bookCard.innerHTML = `
      <div class="book-icon">
      <i class="fas fa-book"></i>
      </div>
      <h3>${book.title}</h3>
      <div class="book-meta">
      <i class="fas fa-user-edit"></i>
      <span>${book.author}</span>
      </div>
      <div class="book-meta">
      <i class="fas fa-tag"></i>
      <span>${book.category}</span>
      </div>
                    <div class="book-meta">
                    <i class="fas fa-barcode"></i>
                        <span>ISBN: ${book.ISBNNumber}</span>
                        </div>
                    <p style="color: var(--dark-gray); font-size: 0.9rem; margin-top: 15px; line-height: 1.5;">
                        ${book.description}
                        </p>
                        <div class="book-actions">
                        <button class="btn btn-outline" onclick="viewBookDetails(${book.id})">
                        <i class="fas fa-info-circle"></i> Details
                        </button>
                        </div>
                        `;

      bookCardsContainer.appendChild(bookCard);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function loadUserDetails() {
  try {
    const response = await fetch(`http://${HOST}:${PORT}/api/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status == 401) {
      alert(response.json().message);
      localStorage.removeItem("token");
      window.location.href = "/pages/login.html";
      return;
    }
    const details = await response.json();
    document.getElementById("fullName").innerHTML = details.user.fullName;
    document.getElementById("rollNumber").innerHTML =
      `Roll No : ${details.user.rollNumber.toUpperCase()}`;
    document.getElementById("fullName").innerHTML = details.user.fullName;
    document.getElementById("rollNumber").innerHTML =
      `Roll No: ${details.user.rollNumber.toUpperCase()}`;
    document.getElementById("totalIssuedBooks").innerHTML =
      details.totalIssuedBooks;
    const today = new Date();
    let daysLeft = -1;

    if (details.nearestDueBook && details.nearestDueBook.dueDate) {
      daysLeft = Math.ceil(
        (new Date(details.nearestDueBook.dueDate) - today) /
          (1000 * 60 * 60 * 24),
      );
    }

    document.getElementById("nearestDueDate").innerHTML =
      `${daysLeft >= 0 ? daysLeft + " Days" : " No Due"}`;
    document.getElementById("totalFine").innerHTML =
      `<i class="fa-solid fa-indian-rupee-sign"></i> ${details.totalFinePending}`;
    document.getElementById("totalAvailableBooks").innerHTML =
      details.totalAvailableBooks;
    let headName = details.user.fullName;
    let firstName = headName?.trim().split(/\s+/)[0] || "";
    document.getElementById("headName").innerHTML = firstName;
  } catch (err) {
    console.log(err)
    throw err;
  }
}

// Load issued books into the table
async function loadIssuedBooks() {
  try {
    const response = await fetch(`http://${HOST}:${PORT}/api/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status == 401) {
      alert(response.json().message);
      localStorage.removeItem("token");
      window.location.href = "/pages/login.html";
      return;
    }
    const details = await response.json();
    issuedBooks = details.ISSUEDBOOKs;

    issuedBooksTable.innerHTML = "";

    if (issuedBooks.length === 0) {
      issuedBooksTable.innerHTML = `
      <tr>
      <td colspan="6" style="text-align: center; padding: 40px; color: var(--dark-gray);">
                            <i class="fas fa-book" style="font-size: 2rem; margin-bottom: 15px; opacity: 0.5; display: block;"></i>
                            <h4>No books issued</h4>
                            <p>You haven't issued any books yet.</p>
                            </td>
                            </tr>
                            `;
      return;
    }

    issuedBooks.forEach((book) => {
      const issueDate = new Date(book.issueDate);
      const dueDate = new Date(book.dueDate);
      const today = new Date();

      // Calculate days left
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Determine status
      let statusClass = "status-ok";
      let statusText = `${daysLeft} days`;

      if (daysLeft < 0) {
        statusClass = "status-overdue";
        statusText = `Overdue by ${Math.abs(daysLeft)} days`;
      } else if (daysLeft === 0) {
        statusClass = "status-overdue";
        statusText = "Due today";
      } else if (daysLeft <= 3) {
        statusClass = "status-overdue";
        statusText = `${daysLeft} days`;
      }
      let particularFine =
        Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)) * 30 > 0
          ? Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24)) * 5
          : 0;
      const fineClass = particularFine > 0 ? "fine-amount" : "no-fine";
      const fineText =
        particularFine > 0
          ? `<i class="fa-solid fa-indian-rupee-sign"></i> ${particularFine}`
          : "No fine";

      const row = document.createElement("tr");
      row.innerHTML = `
    <td><strong>${book.title}</strong></td>
    <td>${issueDate.toLocaleDateString()}</td>
    <td>${dueDate.toLocaleDateString()}</td>
    <td class="${statusClass}">${statusText}</td>
    <td class="${fineClass}">${fineText}</td>
    `;

      issuedBooksTable.appendChild(row);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Search and filter books
function filterBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const author = authorFilter.value;
  const availability = availabilityFilter.value;

  const filtered = books.filter((book) => {
    // Search term filter
    const matchesSearch =
      !searchTerm ||
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.ISBNNumber.includes(searchTerm);

    // Category filter
    const matchesCategory =
      !category || book.category.toLowerCase() === category.toLowerCase();

    // Author filter
    const matchesAuthor =
      !author || book.author.toLowerCase() === author.toLowerCase();

    // Availability filter
    const isAvailable = book.totalCopies > book.issuedCopies;

    const matchesAvailability =
      !availability ||
      (availability === "available" && isAvailable) ||
      (availability == "unavailable" && !isAvailable);

    return (
      matchesSearch && matchesCategory && matchesAuthor && matchesAvailability
    );
  });

  loadBooks(filtered);
}

// Book actions
function issueBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  if (book.status === "issued") {
    alert("This book is already issued to another student.");
    return;
  }

  if (issuedBooks.length >= 5) {
    alert(
      "You have reached the maximum limit of 5 books. Please return some books before issuing new ones.",
    );
    return;
  }

  if (confirm(`Do you want to issue "${book.title}"?`)) {
    // Update book status
    book.status = "issued";

    // Add to issued books
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 14); // Due in 14 days

    issuedBooks.push({
      id: book.id,
      title: book.title,
      issueDate: today.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      fine: 0,
    });

    // Update UI
    filterBooks();
    loadIssuedBooks();

    // Update dashboard card
    document.querySelector(".card-books-issued h3").textContent =
      issuedBooks.length;

    alert(
      `Book "${
        book.title
      }" issued successfully! Due date: ${dueDate.toLocaleDateString()}`,
    );
  }
}

function returnBook(bookId) {
  const issuedBookIndex = issuedBooks.findIndex((b) => b.id === bookId);
  if (issuedBookIndex === -1) return;

  const issuedBook = issuedBooks[issuedBookIndex];
  const book = books.find((b) => b.id === bookId);

  if (!book) return;

  if (confirm(`Return "${issuedBook.title}"?`)) {
    // Update book status
    book.status = "available";

    // Remove from issued books
    issuedBooks.splice(issuedBookIndex, 1);

    // Update UI
    filterBooks();
    loadIssuedBooks();

    // Update dashboard card
    document.querySelector(".card-books-issued h3").textContent =
      issuedBooks.length;

    alert(`Book "${issuedBook.title}" returned successfully!`);
  }
}

function viewBookDetails(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;

  const status = book.status === "available" ? "Available" : "Currently Issued";
  const statusColor = book.status === "available" ? "green" : "red";

  alert(
    `Book Details:\n\n` +
      `Title: ${book.title}\n` +
      `Author: ${book.author}\n` +
      `Category: ${book.category}\n` +
      `ISBN: ${book.ISBNNumber}\n` +
      `Status: ${status}\n\n` +
      `Description: ${book.description}`,
  );
}

// Event listeners
searchBtn.addEventListener("click", filterBooks);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    filterBooks();
  }
});

[categoryFilter, authorFilter, availabilityFilter].forEach((filter) => {
  filter.addEventListener("change", filterBooks);
});

// // Initialize
// window.addEventListener("load", () => {
//   updateCurrentDate();
//   loadBooks();
//   loadIssuedBooks();
//   loadUserDetails();

// });
async function initDashboard() {
  try {
    // show loader
    document.getElementById("pageLoader").style.display = "flex";
    document.getElementById("appContent").style.display = "none";

    // wait for ALL APIs
    await Promise.all([
      loadUserDetails(),
      loadBooks(),
      loadIssuedBooks(),
    ]);

  } catch (err) {
    console.error(err);
    alert("Something went wrong while loading data");
  } finally {
    // hide loader, show app
    document.getElementById("pageLoader").style.display = "none";
    document.getElementById("appContent").style.display = "block";
  }
}

window.addEventListener("load", initDashboard);

window.addEventListener("load", initDashboard);

// Logout Function

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("token");
  localStorage.removeItem("role");

  window.location.href = "/index.html";
});
