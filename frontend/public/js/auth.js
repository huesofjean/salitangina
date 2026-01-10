// =========================
// FIREBASE CORE
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// =========================
// FIREBASE AUTH
// =========================
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// (Optional) Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

// =========================
// FIREBASE CONFIG
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyDDzHoSBLkVUJnRVlpYXP0GG6C_-kOW8nM",
  authDomain: "salitang-ina.firebaseapp.com",
  projectId: "salitang-ina",
  storageBucket: "salitang-ina.firebasestorage.app",
  messagingSenderId: "385948759038",
  appId: "1:385948759038:web:df79300af571e95a7b06af",
  measurementId: "G-JJCR574XB9"
};

// =========================
// INITIALIZE FIREBASE
// =========================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);


// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Logged in ✅");
        window.location.href = "../index.html";
      })
      .catch(() => {
        alert("Invalid email or password ❌");
      });
  });
}



// =========================
// SIGNUP
// =========================    
const signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Account created 🎉");
        window.location.href = "login.html";
      })
      .catch((error) => {
        alert(error.message);
      });
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in as:", user.email);
  } else {
    console.log("Not logged in");
  }
});

