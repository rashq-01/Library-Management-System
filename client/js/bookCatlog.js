        // DOM Elements
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const bookCardsContainer = document.getElementById('bookCardsContainer');
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const categoryFilter = document.getElementById('categoryFilter');
        const authorFilter = document.getElementById('authorFilter');
        const availabilityFilter = document.getElementById('availabilityFilter');
        const loading = document.getElementById('loading');
        const emptyState = document.getElementById('emptyState');
        const bookDetailsModal = document.getElementById('bookDetailsModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const modalBody = document.getElementById('modalBody');

        // Mobile Menu Toggle
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Book Data
        const booksData = [
            {
                id: 1,
                title: "The C++ Programming Language",
                author: "Bjarne Stroustrup",
                category: "Programming",
                isbn: "978-0321563842",
                publisher: "Addison-Wesley Professional",
                publishedYear: "2013",
                edition: "4th Edition",
                pages: 1368,
                language: "English",
                status: "available",
                copiesAvailable: 5,
                totalCopies: 8,
                location: "Shelf A3, Row 2",
                description: "A comprehensive reference and tutorial for C++ programmers covering the latest C++ standards. This book introduces the C++ standard library from the outset, drawing on its common functions and facilities to help you write useful programs without first having to master every language detail.",
                rating: 4.7,
                reviews: 1250,
                tags: ["Programming", "C++", "Computer Science", "Software Development"],
                relatedBooks: ["Effective C++", "C++ Primer", "Modern C++ Design"]
            },
            {
                id: 2,
                title: "Clean Code: A Handbook of Agile Software Craftsmanship",
                author: "Robert C. Martin",
                category: "Programming",
                isbn: "978-0132350884",
                publisher: "Prentice Hall",
                publishedYear: "2008",
                edition: "1st Edition",
                pages: 464,
                language: "English",
                status: "issued",
                copiesAvailable: 0,
                totalCopies: 5,
                location: "Shelf B2, Row 1",
                description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must-read for any developer, software engineer, or manager working with code. You'll be reading code—lots of code. And you will be challenged to think about what's right about that code, and what's wrong with it.",
                rating: 4.5,
                reviews: 890,
                tags: ["Programming", "Software Engineering", "Best Practices", "Agile"],
                relatedBooks: ["The Clean Coder", "Refactoring", "Code Complete"]
            },
            {
                id: 3,
                title: "Design Patterns: Elements of Reusable Object-Oriented Software",
                author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
                category: "Programming",
                isbn: "978-0201633610",
                publisher: "Addison-Wesley Professional",
                publishedYear: "1994",
                edition: "1st Edition",
                pages: 395,
                language: "English",
                status: "available",
                copiesAvailable: 3,
                totalCopies: 6,
                location: "Shelf C1, Row 3",
                description: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems. These 23 patterns allow designers to create more flexible, elegant, and ultimately reusable designs without having to rediscover the design solutions themselves.",
                rating: 4.6,
                reviews: 1120,
                tags: ["Programming", "Design Patterns", "Object-Oriented", "Software Architecture"],
                relatedBooks: ["Head First Design Patterns", "Patterns of Enterprise Application Architecture", "Refactoring to Patterns"]
            },
            {
                id: 4,
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                category: "Fiction",
                isbn: "978-0743273565",
                publisher: "Scribner",
                publishedYear: "1925",
                edition: "Reprint Edition",
                pages: 180,
                language: "English",
                status: "available",
                copiesAvailable: 7,
                totalCopies: 10,
                location: "Shelf F1, Row 4",
                description: "A novel of the Jazz Age that continues to captivate readers with its portrayal of the American Dream, love, and society in the 1920s.",
                rating: 4.2,
                reviews: 850,
                tags: ["Fiction", "Classic", "American Literature", "Jazz Age"],
                relatedBooks: ["To Kill a Mockingbird", "1984", "The Catcher in the Rye"]
            },
            {
                id: 5,
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                category: "Fiction",
                isbn: "978-0061120084",
                publisher: "HarperCollins",
                publishedYear: "1960",
                edition: "50th Anniversary Edition",
                pages: 336,
                language: "English",
                status: "available",
                copiesAvailable: 4,
                totalCopies: 6,
                location: "Shelf F2, Row 1",
                description: "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice.",
                rating: 4.8,
                reviews: 1500,
                tags: ["Fiction", "Classic", "Historical", "Coming-of-Age"],
                relatedBooks: ["The Great Gatsby", "1984", "Animal Farm"]
            },
            {
                id: 6,
                title: "1984",
                author: "George Orwell",
                category: "Fiction",
                isbn: "978-0451524935",
                publisher: "Signet Classic",
                publishedYear: "1949",
                edition: "Reprint Edition",
                pages: 328,
                language: "English",
                status: "issued",
                copiesAvailable: 0,
                totalCopies: 5,
                location: "Shelf F3, Row 2",
                description: "A dystopian social science fiction novel that examines the role of truth and facts within politics and their manipulation.",
                rating: 4.7,
                reviews: 2100,
                tags: ["Fiction", "Dystopian", "Science Fiction", "Political"],
                relatedBooks: ["Animal Farm", "Brave New World", "Fahrenheit 451"]
            }
        ];

        // Initialize books
        function initBooks() {
            loading.style.display = 'block';
            setTimeout(() => {
                filterBooks();
                loading.style.display = 'none';
            }, 800);
        }

        // Render book cards
        function renderBooks(books) {
            bookCardsContainer.innerHTML = '';

            if (books.length === 0) {
                emptyState.style.display = 'block';
                return;
            }

            emptyState.style.display = 'none';

            books.forEach(book => {
                const statusClass = book.status === 'available' ? 'status-available' : 'status-issued';
                const statusText = book.status === 'available' ? '🟢 Available' : '🔴 Issued';

                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
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
                        <span>ISBN: ${book.isbn}</span>
                    </div>
                    <div class="book-description">
                        ${book.description.substring(0, 120)}...
                    </div>
                    <div class="book-actions">
                        <button class="btn btn-outline ${book.status === 'issued' ? 'disabled' : ''}" 
                                ${book.status === 'issued' ? 'disabled' : ''}
                                onclick="borrowBook(${book.id})">
                            <i class="fas fa-book-open"></i> ${book.status === 'issued' ? 'Unavailable' : 'Borrow'}
                        </button>
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

            const filtered = booksData.filter(book => {
                // Search term filter
                const matchesSearch = !searchTerm ||
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm) ||
                    book.isbn.includes(searchTerm);

                // Category filter
                const matchesCategory = !category || book.category === category;

                // Author filter
                const matchesAuthor = !author || book.author === author;

                // Availability filter
                const matchesAvailability = !availability || book.status === availability;

                return matchesSearch && matchesCategory && matchesAuthor && matchesAvailability;
            });

            renderBooks(filtered);
        }

        // Show book details modal
        function showBookDetails(bookId) {
            const book = booksData.find(b => b.id === bookId);
            if (!book) return;

            const statusClass = book.status === 'available' ? 'status-available' : 'status-issued';
            const statusText = book.status === 'available' ? 'Available' : 'Currently Issued';
            const statusIcon = book.status === 'available' ? '🟢' : '🔴';

            // Generate rating stars
            const fullStars = Math.floor(book.rating);
            const hasHalfStar = book.rating % 1 >= 0.5;
            let starsHtml = '';

            for (let i = 1; i <= 5; i++) {
                if (i <= fullStars) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else if (i === fullStars + 1 && hasHalfStar) {
                    starsHtml += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }

            modalBody.innerHTML = `
                <div class="book-details-container">
                    <div class="book-cover-section">
                        <div class="book-cover">
                            <div class="book-cover-icon">
                                <i class="fas fa-book-open"></i>
                            </div>
                            <h3>${book.title.split(':')[0]}</h3>
                            <p>${book.author.split(',')[0]}</p>
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
                                <span class="stat-value">${book.copiesAvailable}</span>
                                <span class="stat-label">Available Copies</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${book.totalCopies}</span>
                                <span class="stat-label">Total Copies</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value">${book.totalCopies - book.copiesAvailable}</span>
                                <span class="stat-label">Issued Copies</span>
                            </div>
                        </div>
                        
                        <div class="modal-actions">
                            <button class="btn btn-secondary btn-block" id="closeDetailsBtn">
                                <i class="fas fa-times"></i> Close
                            </button>
                            ${book.status === 'available' ?
                                `<button class="btn btn-success btn-block" onclick="borrowBookFromModal(${book.id})">
                                    <i class="fas fa-book-open"></i> Borrow Book
                                </button>` :
                                `<button class="btn btn-danger btn-block" disabled>
                                    <i class="fas fa-ban"></i> Currently Unavailable
                                </button>`
                            }
                            <button class="btn btn-primary btn-block" onclick="addToWishlist(${book.id})">
                                <i class="fas fa-heart"></i> Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            `;

            // Show modal
            bookDetailsModal.classList.add('active');

            // Add event listener to close button in modal body
            document.getElementById('closeDetailsBtn').addEventListener('click', closeModal);
        }

        // Close modal function
        function closeModal() {
            bookDetailsModal.classList.remove('active');
        }

        // Event Listeners
        closeModalBtn.addEventListener('click', closeModal);

        bookDetailsModal.addEventListener('click', (e) => {
            if (e.target === bookDetailsModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && bookDetailsModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Book actions
        function borrowBook(bookId) {
            const book = booksData.find(b => b.id === bookId);
            if (book.status === 'available') {
                if (confirm(`Borrow "${book.title}"?`)) {
                    alert(`Successfully borrowed "${book.title}"!`);
                    book.status = 'issued';
                    book.copiesAvailable--;
                    filterBooks();
                }
            } else {
                alert('This book is currently unavailable for borrowing.');
            }
        }

        function borrowBookFromModal(bookId) {
            closeModal();
            setTimeout(() => {
                borrowBook(bookId);
            }, 300);
        }

        function addToWishlist(bookId) {
            const book = booksData.find(b => b.id === bookId);
            alert(`"${book.title}" has been added to your wishlist!`);
        }

        // Search and filter event listeners
        searchBtn.addEventListener('click', filterBooks);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                filterBooks();
            }
        });

        [categoryFilter, authorFilter, availabilityFilter].forEach(filter => {
            filter.addEventListener('change', filterBooks);
        });

        // Initialize
        window.addEventListener('load', () => {
            initBooks();
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