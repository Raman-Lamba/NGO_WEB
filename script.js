import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCX2jdf09JZsBbQPgwBrr-xHXNSitNaxvY",
  authDomain: "fire-19328.firebaseapp.com",
  projectId: "fire-19328",
  storageBucket: "fire-19328.firebasestorage.app",
  messagingSenderId: "624122351738",
  appId: "1:624122351738:web:3ea5a90e70ade2e7706bc3",
  measurementId: "G-4SMB3CY8MN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".circle-container");
  const circles = document.querySelectorAll(".circle");
  const radius = 220; // Adjust this value to change the circle of rotation size

  // Position each circle around the center
  circles.forEach((circle, index) => {
    // Calculate the angle for each circle
    const angle = index * (360 / circles.length);
    const radian = (angle - 90) * (Math.PI / 180);

    // Calculate x and y positions
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);

    // Create inner div for text
    const textDiv = document.createElement("div");
    textDiv.className = "circle-text";
    textDiv.textContent = circle.textContent;
    circle.textContent = "";
    circle.appendChild(textDiv);

    // Position the circle
    circle.style.left = `calc(50% + ${x}px)`;
    circle.style.top = `calc(50% + ${y}px)`;
    circle.style.transform = `translate(-50%, -50%)`;
  });

  // Add animation that rotates the circles but keeps text horizontal
  function updateTextOrientation() {
    const containerRotation =
      getComputedStyle(container).getPropertyValue("transform");
    const matrix = new DOMMatrix(containerRotation);
    const angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);

    // Update each circle's text orientation
    circles.forEach((circle) => {
      const textDiv = circle.querySelector(".circle-text");
      textDiv.style.transform = `rotate(${-angle}deg)`;
    });

    requestAnimationFrame(updateTextOrientation);
  }

  updateTextOrientation();

  // Add hover effect that pauses all animations
  const centerCircle = document.querySelector(".center-circle");
  if (centerCircle) {
    centerCircle.addEventListener("mouseenter", () => {
      container.style.animationPlayState = "paused";
    });
    centerCircle.addEventListener("mouseleave", () => {
      container.style.animationPlayState = "running";
    });
  }
});

//footer js

function showError(inputElement, message) {
  inputElement.classList.add("error");
  let errorDiv = inputElement.nextElementSibling;

  if (!errorDiv || !errorDiv.classList.contains("error-message")) {
    errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
  }

  errorDiv.textContent = message;
}

function clearErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.remove());
  document
    .querySelectorAll(".input")
    .forEach((input) => input.classList.remove("error"));
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function resetForm() {
  document.getElementById("firstname").value = "";
  document.getElementById("email").value = "";
}

// Main form submission handler
document
  .getElementById("newsletter-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear any existing errors
    clearErrors();

    // Get form elements and trimmed values
    const firstnameInput = document.getElementById("firstname");
    const emailInput = document.getElementById("email");
    const firstname = firstnameInput.value.trim();
    const email = emailInput.value.trim();
    let hasErrors = false;

    // Validation
    if (!firstname) {
      showError(firstnameInput, "Please enter your first name");
      hasErrors = true;
    }
    if (!email) {
      showError(emailInput, "Please enter your email");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      showError(emailInput, "Please enter a valid email address");
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      // Add document to Firestore
      await addDoc(collection(db, "subscriptions"), {
        name: firstname,
        email: email,
        timestamp: new Date().toISOString(),
      });

      // Show the thank you modal
      document.getElementById("subscriber-name").textContent = firstname;
      const modal = document.getElementById("thank-you-modal");
      modal.style.display = "block";

      // Add blur effect to main content
      const mainContent = document.querySelector(".main-content");
      mainContent.style.filter = "blur(5px)";
      modal.style.filter = "none"; // Exclude modal from blur

      // Hide the modal after 2 seconds and remove the blur effect
      setTimeout(() => {
        modal.style.display = "none";
        mainContent.style.filter = "none";
      }, 2000);

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error adding document: ", error);

      // Show error message
      const errorMessage = document.createElement("div");
      errorMessage.style.color = "red";
      errorMessage.style.marginTop = "10px";
      errorMessage.textContent = "An error occurred. Please try again.";
      document.getElementById("newsletter-form").appendChild(errorMessage);

      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    }
  });

// Add input event listeners to clear errors when user starts typing
document.querySelectorAll(".input").forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("error");
    const errorMessage = input.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.remove();
    }
  });
});
