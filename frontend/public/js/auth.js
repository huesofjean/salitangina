// =========================
// FIREBASE CORE
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

// =========================
// IMPORT FIREBASE CONFIG
// =========================
import { firebaseConfig } from './config.js';  // <-- ignored, contains secrets

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

// =========================
// FIRESTORE
// =========================
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// =========================
// ANALYTICS (OPTIONAL)
// =========================
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";

// =========================
// INITIALIZE FIREBASE
// =========================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// =========================
// DEFAULT PROFILE PICTURE
// =========================
const DEFAULT_PFP = "../assets/defaultpfp.jpg";

// =========================
// HEADER AUTH STATE TOGGLE
// =========================
function updateHeader(user) {
  const loginLink = document.querySelector(".login-link");
  const signupLink = document.querySelector(".signup-link");
  const profileLink = document.querySelector(".profile-link");
  const logoutLink = document.querySelector(".logout-link");

  if (!loginLink || !signupLink || !profileLink || !logoutLink) return;

if (user) {
    loginLink.style.display = "none";
    signupLink.style.display = "none";
    profileLink.style.display = "inline-block";
    logoutLink.style.display = "inline-block";

    // Show the Upload button for logged-in users
    const uploadLink = document.querySelector(".upload-link");
    if (uploadLink) uploadLink.style.display = "inline-block";

    logoutLink.onclick = () => {
      signOut(auth)
        .then(() => {
          alert("Logged out ✅");
          window.location.reload();
        })
        .catch(err => console.error(err));
    };
} else {
    loginLink.style.display = "inline-block";
    signupLink.style.display = "inline-block";
    profileLink.style.display = "none";
    logoutLink.style.display = "none";

    // Hide the Upload button for non-logged-in users
    const uploadLink = document.querySelector(".upload-link");
    if (uploadLink) uploadLink.style.display = "none";
}

}

// Listen for Firebase auth state changes
onAuthStateChanged(auth, updateHeader);

// =========================
// LOGIN (BY USERNAME)
// =========================
const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
      // Lookup username in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Username not found ❌");
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.email; // get email associated with username

      // Sign in with the retrieved email
      await signInWithEmailAndPassword(auth, email, password);

      alert("Logged in ✅");
      window.location.href = "index.html";

    } catch (error) {
      console.error(error);
      alert("Invalid username or password ❌");
    }
  });
}

// =========================
// SIGNUP
// =========================
const signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      // Ensure username is unique
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("Username already taken ❌");
        return;
      }

      // Create user with email & password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create Firestore profile with default profile picture
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        role: "user",
        profilePic: DEFAULT_PFP, // <-- default profile pic added here
        createdAt: serverTimestamp()
      });

      alert("Account created 🎉");
      window.location.href = "login.html";

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}

// ------------------------
// EXPORT AUTH & DB
// ------------------------
export { auth, db };
