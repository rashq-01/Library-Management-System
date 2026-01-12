const PORT = 5000;

// DOM Elements
const dashboardSidebar = document.getElementById("dashboardSidebar");
const mobileToggle = document.getElementById("mobileToggle");
const menuItems = document.querySelectorAll(".menu-item");
const tabs = document.querySelectorAll(".tab");
const subtabs = document.querySelectorAll("[data-subtab]");
const currentDateElement = document.getElementById("currentDate");

// Modal Elements
const addBookModal = document.getElementById("addBookModal");
const addBookBtn = document.getElementById("addBookBtn");
const closeModalBtn = document.getElementsByClassName("closeModalBtn");
const cancelModalBtn = document.getElementsByClassName("cancelModalBtn");
const saveBookBtn = document.getElementById("saveBookBtn");
// Issue/Return Elements
const calculateFineBtn = document.getElementById("calculateFineBtn");
const fineDisplay = document.getElementById("fineDisplay");
const fineAmount = document.getElementById("fineAmount");
const fineBookId = document.getElementById("fineBookId");
const fineDueDate = document.getElementById("fineDueDate");
const fineReturnDate = document.getElementById("fineReturnDate");
const daysOverdue = document.getElementById("daysOverdue");
const returnDateInput = document.getElementById("returnDate");

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

    // On mobile, close sidebar after clicking
    if (window.innerWidth <= 992) {
      dashboardSidebar.classList.remove("active");
    }
  });
});
document.querySelectorAll(".cancelModalBtn").forEach((btn) => {
  btn.addEventListener("click", () => {
    addBookModal.classList.remove("active");

    document.getElementById("addBookForm")?.reset();
  });
});

// Sub-tab navigation (Issue/Return)
subtabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    // Remove active class from all subtabs
    subtabs.forEach((t) => t.classList.remove("active"));
    // Add active class to clicked subtab
    this.classList.add("active");

    // Get subtab to show
    const subtabToShow = this.getAttribute("data-subtab");

    // Hide all subtab contents
    document.querySelectorAll("#issueReturnTab .tab-content").forEach((tab) => {
      tab.classList.remove("active");
    });

    // Show selected subtab
    document.getElementById(`${subtabToShow}SubTab`).classList.add("active");

    // Reset fine display when switching to return tab
    if (subtabToShow === "return") {
      fineDisplay.style.display = "none";
    }
  });
});

// Mobile sidebar toggle
mobileToggle.addEventListener("click", () => {
  dashboardSidebar.classList.toggle("active");
});

// Modal functions
addBookBtn.addEventListener("click", () => {
  addBookModal.classList.add("active");
});

const closeModalBook = () => {
  addBookModal.classList.remove("active");
  document.getElementById("addBookForm").reset();
};

// Close buttons (X)
Array.from(closeModalBtn).forEach((btn) => {
  btn.addEventListener("click", () => {
    addBookModal.classList.remove("active");
    document.getElementById("addBookForm")?.reset();
  });
});

// Cancel buttons (⚠️ you used SAME ID twice – see note below)
Array.from(document.querySelectorAll("#cancelModalBtn")).forEach((btn) => {
  btn.addEventListener("click", () => {
    addBookModal.classList.remove("active");
    document.getElementById("addBookForm")?.reset();
  });
});

// Close modal when clicking outside
addBookModal.addEventListener("click", (e) => {
  if (e.target === addBookModal) {
    closeModalBook();
  }
});

// Save book  // API call
saveBookBtn.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      alert("Unauthorized. Please Login");
      window.location.href = "/pages/login.html";
      return;
    }
    const response = await fetch(`http://localhost:${PORT}/api/addBook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // title,ISBNNumber,author,category,publisher,publishedYear,edition,pages,language,location,description,totalCopies
      body: JSON.stringify({
        title: document.getElementById("newBookTitle").value.trim(),
        ISBNNumber: document.getElementById("isbnNo").value.trim(),
        author: document.getElementById("newBookAuthor").value.trim(),
        category: document.getElementById("newBookCategory").value.trim(),
        publisher: document.getElementById("publisher").value.trim(),
        publishedYear: Number(document.getElementById("publishedYear").value),
        edition: document.getElementById("edition").value.trim(),
        pages: Number(document.getElementById("page").value),
        language: document.getElementById("language").value.trim(),
        location: document.getElementById("location").value.trim(),
        description: document.getElementById("description").value.trim(),
        totalCopies: Number(document.getElementById("newBookCopies").value),
      }),
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);
  } catch (err) {
    console.error(err.message);
  }
});

// // Calculate fine
// calculateFineBtn.addEventListener("click", () => {
//   const bookId = document.getElementById("returnBookId").value;
//   const returnDate = document.getElementById("returnDate").value;

//   if (!bookId || !returnDate) {
//     alert("Please enter Book ID and Return Date");
//     return;
//   }

//   // Mock data - in real app, you would fetch due date from database
//   const dueDate = "2023-10-20"; // Mock due date
//   const returnDateObj = new Date(returnDate);
//   const dueDateObj = new Date(dueDate);

//   // Calculate days overdue
//   const timeDiff = returnDateObj.getTime() - dueDateObj.getTime();
//   const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

//   // Calculate fine
//   let fine = 0;
//   if (daysDiff > 0) {
//     fine = daysDiff * 1.0; // $1 per day
//   }

//   // Display fine
//   fineBookId.textContent = bookId;
//   fineDueDate.textContent = dueDate;
//   fineReturnDate.textContent = returnDate;
//   daysOverdue.textContent = daysDiff > 0 ? daysDiff : 0;
//   fineAmount.textContent = `$${fine.toFixed(2)}`;

//   fineDisplay.style.display = "block";
// });

document.getElementById("returnForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const bookId = document.getElementById("returnBookId").value;

  if (bookId) {
    alert(`Book ${bookId} returned successfully!`);
    this.reset();
    fineDisplay.style.display = "none";
  }
});

// Set default dates for issue form
window.addEventListener("load", () => {
  updateCurrentDate();

  // Set default dates for issue form
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 14); // 14 days from today

  if (returnDateInput) {
    returnDateInput.value = today.toISOString().split("T")[0];
  }

  // Add click handlers for edit/delete buttons
  document.querySelectorAll(".action-edit").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const bookId = row.cells[0].textContent;
      const bookName = row.cells[1].textContent;
      alert(`Edit book: ${bookName} (ID: ${bookId})`);
    });
  });

  document.querySelectorAll(".action-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const bookId = row.cells[0].textContent;
      const bookName = row.cells[1].textContent;

      if (
        confirm(
          `Are you sure you want to delete "${bookName}" (ID: ${bookId})?`
        )
      ) {
        alert(`Book "${bookName}" deleted successfully!`);
        // In a real app, you would remove the row from the table
      }
    });
  });
});

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

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl + B to add book
  if (e.ctrlKey && e.key === "b") {
    e.preventDefault();
    addBookModal.classList.add("active");
  }

  // Esc to close modal
  if (e.key === "Escape") {
    if (addBookModal.classList.contains("active")) {
      closeModalBook();
    }
  }
});
