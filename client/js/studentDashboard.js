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

// Book data
const books = [
  {
    id: 1,
    title: "The C++ Programming Language",
    author: "Bjarne Stroustrup",
    category: "Programming",
    isbn: "978-0321563842",
    status: "available",
    description: "A comprehensive reference and tutorial for C++ programmers.",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    isbn: "978-0132350884",
    status: "issued",
    description: "A handbook of agile software craftsmanship.",
  },
  {
    id: 3,
    title: "Design Patterns",
    author: "Erich Gamma",
    category: "Programming",
    isbn: "978-0201633610",
    status: "available",
    description: "Elements of reusable object-oriented software.",
  },
  {
    id: 4,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    isbn: "978-0743273565",
    status: "available",
    description: "A classic novel of the Jazz Age.",
  },
  {
    id: 5,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    isbn: "978-0061120084",
    status: "issued",
    description: "A novel about racial injustice in the American South.",
  },
  {
    id: 6,
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    isbn: "978-0451524935",
    status: "available",
    description: "A dystopian social science fiction novel.",
  },
  {
    id: 7,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    isbn: "978-0553380163",
    status: "available",
    description: "A popular-science book on cosmology.",
  },
  {
    id: 8,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    isbn: "978-0062316097",
    status: "available",
    description:
      "Explores the history of humankind from evolution to modern times.",
  },
];

// Issued books data
const issuedBooks = [
  {
    id: 2,
    title: "Clean Code",
    issueDate: "2023-10-10",
    dueDate: "2023-10-24",
    fine: 0,
  },
  {
    id: 3,
    title: "Design Patterns",
    issueDate: "2023-10-05",
    dueDate: "2023-10-19",
    fine: 5.0,
  },
  {
    id: 5,
    title: "To Kill a Mockingbird",
    issueDate: "2023-10-15",
    dueDate: "2023-10-29",
    fine: 0,
  },
];

// Load books into the search page
function loadBooks(filteredBooks = books) {
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

    const statusClass =
      book.status === "available" ? "status-available" : "status-issued";
    const statusIcon = book.status === "available" ? "🟢" : "🔴";

    bookCard.innerHTML = `
                    <span class="book-status ${statusClass}">${statusIcon} ${
      book.status.charAt(0).toUpperCase() + book.status.slice(1)
    }</span>
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
                        <span>ISBN: ${book.isbn}</span>
                    </div>
                    <p style="color: var(--dark-gray); font-size: 0.9rem; margin-top: 15px; line-height: 1.5;">
                        ${book.description}
                    </p>
                    <div class="book-actions">
                        <button class="btn btn-outline ${
                          book.status === "issued" ? "disabled" : ""
                        }" 
                                ${book.status === "issued" ? "disabled" : ""}
                                onclick="issueBook(${book.id})">
                            <i class="fas fa-book-open"></i> ${
                              book.status === "issued"
                                ? "Already Issued"
                                : "Issue Book"
                            }
                        </button>
                        <button class="btn btn-outline" onclick="viewBookDetails(${
                          book.id
                        })">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                `;

    bookCardsContainer.appendChild(bookCard);
  });
}

// Load issued books into the table
function loadIssuedBooks() {
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

    const fineClass = book.fine > 0 ? "fine-amount" : "no-fine";
    const fineText = book.fine > 0 ? `$${book.fine.toFixed(2)}` : "No fine";

    const row = document.createElement("tr");
    row.innerHTML = `
                    <td><strong>${book.title}</strong></td>
                    <td>${issueDate.toLocaleDateString()}</td>
                    <td>${dueDate.toLocaleDateString()}</td>
                    <td class="${statusClass}">${statusText}</td>
                    <td class="${fineClass}">${fineText}</td>
                    <td>
                        <button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.85rem;" onclick="returnBook(${
                          book.id
                        })">
                            <i class="fas fa-undo-alt"></i> Return
                        </button>
                    </td>
                `;

    issuedBooksTable.appendChild(row);
  });
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
      book.isbn.includes(searchTerm);

    // Category filter
    const matchesCategory = !category || book.category === category;

    // Author filter
    const matchesAuthor = !author || book.author === author;

    // Availability filter
    const matchesAvailability = !availability || book.status === availability;

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
      "You have reached the maximum limit of 5 books. Please return some books before issuing new ones."
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
      }" issued successfully! Due date: ${dueDate.toLocaleDateString()}`
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
      `ISBN: ${book.isbn}\n` +
      `Status: ${status}\n\n` +
      `Description: ${book.description}`
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

issueNewBookBtn.addEventListener("click", () => {
  // Switch to search tab
  menuItems.forEach((i) => i.classList.remove("active"));
  document.querySelector('[data-tab="searchBook"]').classList.add("active");

  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.getElementById("searchBookTab").classList.add("active");

  // Focus search input
  searchInput.focus();
});

// Initialize
window.addEventListener("load", () => {
  updateCurrentDate();
  loadBooks();
  loadIssuedBooks();

  // Calculate nearest due date
  if (issuedBooks.length > 0) {
    const today = new Date();
    const dueDates = issuedBooks.map((book) => {
      const dueDate = new Date(book.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    });

    const positiveDueDates = dueDates.filter((days) => days >= 0);
    const nearestDueDate =
      positiveDueDates.length > 0 ? Math.min(...positiveDueDates) : 0;

    document.querySelector(".card-due-date h3").textContent =
      nearestDueDate > 0 ? `${nearestDueDate} Days` : "Overdue";
  }

  // Calculate total fine
  const totalFine = issuedBooks.reduce((sum, book) => sum + book.fine, 0);
  document.querySelector(".card-fine h3").textContent = `$${totalFine.toFixed(
    2
  )}`;

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 992 &&
      !dashboardSidebar.contains(e.target) &&
      !mobileToggle.contains(e.target) &&
      dashboardSidebar.classList.contains("active")
    ) {
      dashboardSidebar.classList.remove("active");
    }
  });
});


