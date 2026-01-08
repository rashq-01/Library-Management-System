// Form validation
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleSelect = document.getElementById("role");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const roleError = document.getElementById("roleError");

// Email/Roll No validation
function validateEmailOrRollNo(value) {
  // Check if it's an email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Check if it's a roll number (alphanumeric with possible dashes/underscores)
  const rollNoRegex = /^[A-Za-z0-9_-]+$/;

  return emailRegex.test(value) || rollNoRegex.test(value);
}

// Password validation
function validatePassword(value) {
  return value.length >= 6;
}

// Role validation
function validateRole(value) {
  return value && value !== "";
}

// Show error
function showError(input, errorElement, message) {
  input.classList.remove("success");
  input.classList.add("error");
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

// Show success
function showSuccess(input, errorElement) {
  input.classList.remove("error");
  input.classList.add("success");
  errorElement.classList.remove("show");
}

// Validate field on input
emailInput.addEventListener("blur", () => {
  if (!validateEmailOrRollNo(emailInput.value)) {
    showError(
      emailInput,
      emailError,
      "Please enter a valid email or roll number"
    );
  } else {
    showSuccess(emailInput, emailError);
  }
});

passwordInput.addEventListener("blur", () => {
  if (!validatePassword(passwordInput.value)) {
    showError(
      passwordInput,
      passwordError,
      "Password must be at least 6 characters"
    );
  } else {
    showSuccess(passwordInput, passwordError);
  }
});

roleSelect.addEventListener("change", () => {
  if (!validateRole(roleSelect.value)) {
    showError(roleSelect, roleError, "Please select a role");
  } else {
    showSuccess(roleSelect, roleError);
  }
});

// Form submission
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;

  // Validate all fields
  if (!validateEmailOrRollNo(emailInput.value)) {
    showError(
      emailInput,
      emailError,
      "Please enter a valid email or roll number"
    );
    isValid = false;
  } else {
    showSuccess(emailInput, emailError);
  }

  if (!validatePassword(passwordInput.value)) {
    showError(
      passwordInput,
      passwordError,
      "Password must be at least 6 characters"
    );
    isValid = false;
  } else {
    showSuccess(passwordInput, passwordError);
  }

  if (!validateRole(roleSelect.value)) {
    showError(roleSelect, roleError, "Please select a role");
    isValid = false;
  } else {
    showSuccess(roleSelect, roleError);
  }

  // If valid, submit form (in real app, this would go to server)
  if (isValid) {
    // Simulate login process
    const submitBtn = loginForm.querySelector(".btn-primary");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      alert(
        `Login successful! Welcome ${
          roleSelect.value === "admin" ? "Admin" : "Student"
        }`
      );

      // Redirect based on role
      if (roleSelect.value === "admin") {
        window.location.href = "dashboard.html"; // You'll need to create this
      } else {
        window.location.href = "student-dashboard.html"; // You'll need to create this
      }

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  }
});

// Forgot password functionality
const forgotPasswordLink = document.querySelector(".forgot-password");
forgotPasswordLink.addEventListener("click", function (e) {
  e.preventDefault();
  const email = prompt("Please enter your email to reset password:");
  if (email) {
    // Simple email validation
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert(`Password reset link has been sent to ${email}`);
    } else {
      alert("Please enter a valid email address");
    }
  }
});
