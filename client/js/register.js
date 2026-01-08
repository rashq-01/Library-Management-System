// Form elements
const registerForm = document.getElementById("registerForm");
const fullNameInput = document.getElementById("fullName");
const rollNoInput = document.getElementById("rollNo");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const termsCheckbox = document.getElementById("terms");
const registerBtn = document.getElementById("registerBtn");

// Error elements
const nameError = document.getElementById("nameError");
const rollNoError = document.getElementById("rollNoError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

// Password strength element
const passwordStrength = document.getElementById("passwordStrength");

// Validation functions
function validateName(value) {
  return value.trim().length >= 3;
}

function validateRollNo(value) {
  const rollNoRegex = /^[A-Za-z0-9_-]+$/;
  return rollNoRegex.test(value) && value.length >= 4;
}

function validateEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function validatePassword(value) {
  // At least 8 characters, at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(value);
}

function checkPasswordStrength(value) {
  if (value.length === 0) {
    return { strength: 0, text: "Empty" };
  }

  let strength = 0;

  // Length check
  if (value.length >= 8) strength += 1;
  if (value.length >= 12) strength += 1;

  // Character variety checks
  if (/[A-Z]/.test(value)) strength += 1;
  if (/[a-z]/.test(value)) strength += 1;
  if (/[0-9]/.test(value)) strength += 1;
  if (/[^A-Za-z0-9]/.test(value)) strength += 1;

  if (strength <= 2) {
    return { strength: 1, text: "Weak" };
  } else if (strength <= 4) {
    return { strength: 2, text: "Medium" };
  } else {
    return { strength: 3, text: "Strong" };
  }
}

function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
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

// Update password strength indicator
function updatePasswordStrength(value) {
  const strength = checkPasswordStrength(value);

  // Reset classes
  passwordStrength.classList.remove(
    "strength-weak",
    "strength-medium",
    "strength-strong"
  );

  // Add appropriate class
  if (strength.strength === 1) {
    passwordStrength.classList.add("strength-weak");
  } else if (strength.strength === 2) {
    passwordStrength.classList.add("strength-medium");
  } else if (strength.strength === 3) {
    passwordStrength.classList.add("strength-strong");
  }

  // Update text
  passwordStrength.querySelector(".strength-text").textContent =
    value.length === 0 ? "Password strength" : `${strength.text} password`;
}

// Field validation on blur
fullNameInput.addEventListener("blur", () => {
  if (!validateName(fullNameInput.value)) {
    showError(
      fullNameInput,
      nameError,
      "Please enter your full name (min 3 characters)"
    );
  } else {
    showSuccess(fullNameInput, nameError);
  }
});

rollNoInput.addEventListener("blur", () => {
  if (!validateRollNo(rollNoInput.value)) {
    showError(
      rollNoInput,
      rollNoError,
      "Roll number must be alphanumeric (e.g., CS2023001)"
    );
  } else {
    showSuccess(rollNoInput, rollNoError);
  }
});

emailInput.addEventListener("blur", () => {
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, emailError, "Please enter a valid email address");
  } else {
    showSuccess(emailInput, emailError);
  }
});

passwordInput.addEventListener("input", () => {
  updatePasswordStrength(passwordInput.value);

  if (!validatePassword(passwordInput.value)) {
    showError(
      passwordInput,
      passwordError,
      "Password must be at least 8 characters with letters and numbers"
    );
  } else {
    showSuccess(passwordInput, passwordError);
  }

  // Check if passwords match
  if (
    confirmPasswordInput.value &&
    !passwordsMatch(passwordInput.value, confirmPasswordInput.value)
  ) {
    showError(
      confirmPasswordInput,
      confirmPasswordError,
      "Passwords do not match"
    );
  } else if (confirmPasswordInput.value) {
    showSuccess(confirmPasswordInput, confirmPasswordError);
  }
});

confirmPasswordInput.addEventListener("blur", () => {
  if (!passwordsMatch(passwordInput.value, confirmPasswordInput.value)) {
    showError(
      confirmPasswordInput,
      confirmPasswordError,
      "Passwords do not match"
    );
  } else {
    showSuccess(confirmPasswordInput, confirmPasswordError);
  }
});

// Form submission
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;

  // Validate all fields
  if (!validateName(fullNameInput.value)) {
    showError(
      fullNameInput,
      nameError,
      "Please enter your full name (min 3 characters)"
    );
    isValid = false;
  } else {
    showSuccess(fullNameInput, nameError);
  }

  if (!validateRollNo(rollNoInput.value)) {
    showError(
      rollNoInput,
      rollNoError,
      "Roll number must be alphanumeric (e.g., CS2023001)"
    );
    isValid = false;
  } else {
    showSuccess(rollNoInput, rollNoError);
  }

  if (!validateEmail(emailInput.value)) {
    showError(emailInput, emailError, "Please enter a valid email address");
    isValid = false;
  } else {
    showSuccess(emailInput, emailError);
  }

  if (!validatePassword(passwordInput.value)) {
    showError(
      passwordInput,
      passwordError,
      "Password must be at least 8 characters with letters and numbers"
    );
    isValid = false;
  } else {
    showSuccess(passwordInput, passwordError);
  }

  if (!passwordsMatch(passwordInput.value, confirmPasswordInput.value)) {
    showError(
      confirmPasswordInput,
      confirmPasswordError,
      "Passwords do not match"
    );
    isValid = false;
  } else {
    showSuccess(confirmPasswordInput, confirmPasswordError);
  }

  if (!termsCheckbox.checked) {
    alert("Please agree to the Terms of Service and Privacy Policy");
    isValid = false;
  }

  // If valid, submit form
  if (isValid) {
    // Simulate registration process
    const originalText = registerBtn.textContent;
    registerBtn.textContent = "Creating account...";
    registerBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // In a real application, you would send data to server here
      const userData = {
        name: fullNameInput.value,
        rollNo: rollNoInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        role: "student",
      };

      // Save to localStorage for demo purposes
      localStorage.setItem("libraTechUser", JSON.stringify(userData));

      alert(
        `Registration successful! Welcome ${fullNameInput.value}. You can now login.`
      );

      // Redirect to login page
      window.location.href = "login.htm";

      registerBtn.textContent = originalText;
      registerBtn.disabled = false;
    }, 2000);
  }
});

// Pre-fill form for demo purposes (remove in production)
window.addEventListener("load", () => {
  // Only pre-fill if there's no data in form
  if (!fullNameInput.value) {
    fullNameInput.value = "";
    rollNoInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
    termsCheckbox.checked = true;

    // Trigger validation for all fields
    updatePasswordStrength(passwordInput.value);
    showSuccess(fullNameInput, nameError);
    showSuccess(rollNoInput, rollNoError);
    showSuccess(emailInput, emailError);
    showSuccess(passwordInput, passwordError);
    showSuccess(confirmPasswordInput, confirmPasswordError);
  }
});
