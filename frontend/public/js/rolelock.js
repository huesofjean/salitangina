import { auth, db } from "./auth.js";
import { doc, getDoc } from 
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { onAuthStateChanged } from 
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("Profile missing ❌");
    await auth.signOut();
    return;
  }

  const { role } = snap.data();

  // ✅ USER-ONLY ACCESS
  if (role !== "user") {
    alert("Access denied 🔒");
    window.location.href = "index.html";
  }
});
