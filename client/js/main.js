// Mobile menu toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Add active class to current page in nav
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-links a").forEach((link) => {
  if (
    link.getAttribute("href") === currentPage ||
    (currentPage === "" && link.getAttribute("href") === "index.html")
  ) {
    link.classList.add("active");
  }
});

// Animated statistics counter
function animateCounter(elementId, finalValue, duration) {
  let startValue = 0;
  const element = document.getElementById(elementId);
  const increment = finalValue / (duration / 16); // 60fps

  const updateCounter = () => {
    startValue += increment;
    if (startValue < finalValue) {
      element.textContent = Math.floor(startValue).toLocaleString();
      setTimeout(updateCounter, 16);
    } else {
      element.textContent = finalValue.toLocaleString();
    }
  };

  updateCounter();
}

// Start counters when the statistics section is visible
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Start the counters
        animateCounter("bookCount", 12543, 2000);
        animateCounter("studentCount", 3421, 2000);
        animateCounter("issuedCount", 8924, 2000);

        // Unobserve after triggering once
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

// Observe the statistics section
const statisticsSection = document.querySelector(".statistics");
observer.observe(statisticsSection);

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
