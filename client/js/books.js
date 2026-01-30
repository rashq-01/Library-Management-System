import {PORT,HOST} from "./HOST.js";
// DOM Elements
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const bookCardsContainer = document.getElementById("bookCardsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const authorFilter = document.getElementById("authorFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const loading = document.getElementById("loading");
const emptyState = document.getElementById("emptyState");
const bookDetailsModal = document.getElementById("bookDetailsModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalBody = document.getElementById("modalBody");


// Mobile Menu Toggle
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Book Data
let booksData = [];

async function getAllBooks() {
  try {
    loading.style.display = "block";
    const response = await fetch(`http://${HOST}:${PORT}/api/bookCatalog`, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    booksData = data.BOOKs;

    loading.style.display = "none";
    filterBooks();
  } catch (err) {
    loading.style.display = "none";
    console.error(err);
    alert(err.message);
  }
}

// Render book cards
function renderBooks(books) {
  bookCardsContainer.innerHTML = "";

  if (books.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  books.forEach((book) => {
    const statusClass =
      book.issuedCopies < book.totalCopies
        ? "status-available"
        : "status-issued";
    const statusText =
      book.issuedCopies < book.totalCopies ? "🟢 Available" : "🔴 Issued";

    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
                    <span class="book-status ${statusClass}">${statusText}</span>
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
                    <div class="book-description">
                        ${book.description.substring(0, 120)}...
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-outline" onclick="showBookDetails(${book.id})">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                `;
    bookCardsContainer.appendChild(bookCard);
  });
}

// Filter books
function filterBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const author = authorFilter.value;
  const availability = availabilityFilter.value;

  const filtered = booksData.filter((book) => {
    // Search term filter
    const matchesSearch =
      !searchTerm ||
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.ISBNNumber.toString().includes(searchTerm);

    // Category filter
    const matchesCategory = !category || book.category.toLowerCase() === category.toLowerCase();

    // Author filter
    const matchesAuthor = !author || book.author === author;

    // Availability filter
    const isAvailable = book.issuedCopies < book.totalCopies;
    const matchesAvailability =
      !availability ||
      (availability === "available" && isAvailable) ||
      (availability === "issued" && !isAvailable);

    return (
      matchesSearch && matchesCategory && matchesAuthor && matchesAvailability
    );
  });

  renderBooks(filtered);
}

// Show book details modal
function showBookDetails(bookId) {
  const book = booksData.find((b) => b.id === bookId);
  if (!book) return;

  const statusClass =
    book.issuedCopies < book.totalCopies ? "status-available" : "status-issued";
  const statusText =
    book.issuedCopies < book.totalCopies ? "Available" : "Currently Issued";
  const statusIcon = book.issuedCopies < book.totalCopies ? "🟢" : "🔴";

  modalBody.innerHTML = `
                <div class="book-details-container">
                    <div class="book-cover-section">
                        <div class="book-cover">
                            <div class="book-cover-icon">
                                <i class="fas fa-book-open"></i>
                            </div>
                            <h3>${book.title.split(":")[0]}</h3>
                            <p>${book.author.split(",")[0]}</p>
                        </div>
                    </div>
                    
                    <div class="book-info-section">
                        <h3>${book.title}</h3>
                        
                        <span class="status-badge-large ${statusClass}" style="font-size: 1.1rem;">
                            ${statusIcon} ${statusText}
                        </span>
                        
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Author</strong>
                                <span>${book.author}</span>
                            </div>
                            <div class="info-item">
                                <strong>Category</strong>
                                <span>${book.category}</span>
                            </div>
                            <div class="info-item">
                                <strong>Publisher</strong>
                                <span>${book.publisher}</span>
                            </div>
                            <div class="info-item">
                                <strong>Published Year</strong>
                                <span>${book.publishedYear}</span>
                            </div>
                            <div class="info-item">
                                <strong>Edition</strong>
                                <span>${book.edition}</span>
                            </div>
                            <div class="info-item">
                                <strong>Pages</strong>
                                <span>${book.pages} pages</span>
                            </div>
                            <div class="info-item">
                                <strong>Language</strong>
                                <span>${book.language}</span>
                            </div>
                            <div class="info-item">
                                <strong>Location</strong>
                                <span>${book.location}</span>
                            </div>
                        </div>
                        
                        <div class="book-description-box">
                            <h4><i class="fas fa-align-left"></i> Description</h4>
                            <p>${book.description}</p>
                        </div>
                        
                        <div class="book-stats">
                            <div class="stat-item">
                                <span class="stat-value">${book.totalCopies - book.issuedCopies}</span>
                                <span class="stat-label">Available Copies</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${book.totalCopies}</span>
                                <span class="stat-label">Total Copies</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${book.issuedCopies}</span>
                                <span class="stat-label">Issued Copies</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            `;

  // Show modal
  bookDetailsModal.classList.add("active");

  // Add event listener to close button in modal body
  document
    .getElementById("closeDetailsBtn")
    .addEventListener("click", closeModal);
}

// Close modal function
function closeModal() {
  bookDetailsModal.classList.remove("active");
}

// Event Listeners
closeModalBtn.addEventListener("click", closeModal);

bookDetailsModal.addEventListener("click", (e) => {
  if (e.target === bookDetailsModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && bookDetailsModal.classList.contains("active")) {
    closeModal();
  }
});

// Search and filter event listeners
searchBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    filterBooks();
});
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    filterBooks();
  }
});

[categoryFilter, authorFilter, availabilityFilter].forEach((filter) => {
  filter.addEventListener("change", filterBooks);
});

// Initialize
window.addEventListener("load", () => {
  getAllBooks();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});
