import { auth, db } from "./auth.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const DEFAULT_PFP = "../images/default-profile.png";

export function initHeader() {
  const loginLink = document.querySelector(".login-link");
  const signupLink = document.querySelector(".signup-link");
  const logoutLink = document.querySelector(".logout-link");
  const profilePic = document.getElementById("header-profile-pic");

  if (!profilePic) {
    console.warn("Header PFP not found");
    return;
  }

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      loginLink.style.display = "inline-block";
      signupLink.style.display = "inline-block";
      logoutLink.style.display = "none";
      profilePic.src = DEFAULT_PFP;
      return;
    }

    loginLink.style.display = "none";
    signupLink.style.display = "none";
    logoutLink.style.display = "inline-block";

    const userDocRef = doc(db, "users", user.uid);

    onSnapshot(userDocRef, (snap) => {
      if (!snap.exists()) {
        profilePic.src = DEFAULT_PFP;
        return;
      }

      profilePic.src = snap.data().profilePic || DEFAULT_PFP;
    });
  });

  logoutLink.onclick = async () => {
    await signOut(auth);
    window.location.reload();
  };
}
