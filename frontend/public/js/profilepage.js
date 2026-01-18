// =========================
// PROFILE PAGE
// =========================
import { auth, db } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const DEFAULT_PFP = "/images/default-profile.png";

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const emailSpan = document.getElementById("email");
  const bioTextarea = document.getElementById("bio");
  const profilePicImg = document.getElementById("profile-pic");
  const profilePicInput = document.getElementById("profile-pic-input");
  const saveBtn = document.getElementById("save-profile");

  let currentUser = null;
  let userDocRef = null;
  let uploadedProfilePicData = "";

  // =========================
  // AUTH STATE
  // =========================
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Please log in first!");
      window.location.href = "login.html";
      return;
    }

    currentUser = user;
    userDocRef = doc(db, "users", user.uid);

    const snap = await getDoc(userDocRef);

    if (!snap.exists()) {
      await setDoc(userDocRef, {
        username: "",
        bio: "",
        profilePic: DEFAULT_PFP,
        createdAt: serverTimestamp()
      });
    }

    const data = snap.exists() ? snap.data() : {};

    usernameInput.value = data.username || "";
    emailSpan.textContent = user.email;
    bioTextarea.value = data.bio || "";
    profilePicImg.src = data.profilePic || DEFAULT_PFP;
    uploadedProfilePicData = data.profilePic || DEFAULT_PFP;
  });

  // =========================
  // PROFILE PIC CHANGE
  // =========================
  profilePicInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || !userDocRef) return;

    const compressed = await compressImage(file, 300, 300);
    const base64 = await fileToBase64(compressed);

    // Instant local preview
    profilePicImg.src = base64;
    uploadedProfilePicData = base64;

    // Save immediately
    await setDoc(
      userDocRef,
      { profilePic: base64 },
      { merge: true }
    );

    // 🔥 Notify header instantly
    document.dispatchEvent(
      new CustomEvent("pfp-updated", { detail: base64 })
    );
  });

  // =========================
  // SAVE PROFILE
  // =========================
  saveBtn.addEventListener("click", async () => {
    if (!userDocRef) return;

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {
      await setDoc(
        userDocRef,
        {
          username: usernameInput.value.trim(),
          bio: bioTextarea.value.trim(),
          profilePic: uploadedProfilePicData
        },
        { merge: true }
      );

      alert("Profile updated ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile ❌");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Profile";
    }
  });
});

// =========================
// HELPERS
// =========================
function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function compressImage(file, maxW, maxH) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const scale = Math.min(maxW / width, maxH / height, 1);
      width *= scale;
      height *= scale;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) =>
          resolve(
            new File([blob], file.name, { type: "image/jpeg" })
          ),
        "image/jpeg",
        0.7
      );
    };
    img.src = URL.createObjectURL(file);
  });
}
