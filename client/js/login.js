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

// Form submission
loginForm.addEventListener("submit", async (e) => {
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
  // If valid, submit form (in real app, this would go to server)
  if (isValid) {
    // Simulate login process
    const submitBtn = loginForm.querySelector(".btn-primary");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    // Calling backend login api
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          emailOrRoll: emailInput.value.trim(),
          password: passwordInput.value.trim(),
        }),
      });

      const data = await response.json();

      if (!data.success) {
        document.getElementById("msgBox").innerText = data.message;
        if(data.err == "psw"){
          passwordInput.classList.remove("success");
          passwordInput.classList.add("error");
        }
        else if(data.err == "usr"){
          emailInput.classList.remove("success");
          emailInput.classList.add("error");
        }
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role == "student") {
        window.location.href = "/pages/studentDashboard.html";
      } else if (data.role == "admin") {
        window.location.href = "/pages/adminDashboard.html";
      } else {
        document.getElementById("msgBox").innerText = "Unknown Role";
      }
    } catch (err) {
      document.getElementById("msgBox").innerText = err.message;
      console.error(err.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
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

//Backend Connections

// loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const emailOrRoll = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   if (!emailOrRoll || !password) {
//     alert("All fields are required.");
//     return;
//   }

//   try {
//     const response = await fetch("http://localhost:5000/api/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         emailOrRoll,
//         password,
//       }),
//     });

//     const data = await response.json();

//     if (!data.success) {
//       alert(data.message || "Login Failed");
//       return;
//     }

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("role", data.role);

//     if (data.role == "student") {
//       window.location.href = "/pages/studentDashboard.html";
//     } else if (data.role == "admin") {
//       window.location.hre = "/pages/adminDashboard.html";
//     } else {
//       alert("Unknown Role");
//     }
//   } catch (err) {
//     alert("Server Error");
//     console.error(err.message);
//   }
// });
