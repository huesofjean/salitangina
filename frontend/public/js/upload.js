// Firebase imports
import { auth, db } from "./auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Cloudinary settings
const CLOUD_NAME = "dpxghkkkn";          // Your Cloudinary cloud name
const UPLOAD_PRESET = "salitang-ina";    // Your unsigned upload preset

// Form
const form = document.getElementById("upload-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return alert("Kailangan mong mag-log in ❌");

  // Get form values
  const fileInput = document.getElementById("pdf-file");
  const title = document.getElementById("work-title").value.trim();
  const creators = document.getElementById("creators").value
    .split(",")
    .map(c => c.trim())
    .filter(c => c);
  const category = document.getElementById("category").value;
  const language = document.getElementById("language").value;
  const tags = document.getElementById("tags").value
    .split(",")
    .map(t => t.trim())
    .filter(t => t);

  // Validate file
  if (fileInput.files.length === 0) return alert("Pumili ng PDF file muna ❌");
  const file = fileInput.files[0];

  // Extra basic validation
  if (!title) return alert("Ilagay ang pamagat ng likha ❌");
  if (!creators.length) return alert("Ilagay ang creator(s) ❌");
  if (!category) return alert("Pumili ng kategorya ❌");
  if (!language) return alert("Pumili ng wika ❌");

  try {
    // Upload PDF to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    console.log("Uploading PDF to Cloudinary...");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
      { method: "POST", body: formData }
    );

    const data = await response.json();
    console.log("Cloudinary response:", data);

    // Make sure we got a valid URL
    const fileUrl = data.secure_url;
    if (!fileUrl) {
      alert("❌ Cloudinary upload failed. Check your preset & file type.");
      return;
    }

    // Save metadata to Firestore
    console.log("Saving metadata to Firestore...");
    await addDoc(collection(db, "pdfs"), {
      uid: user.uid,
      title,
      creators,
      category,
      language,
      tags,
      fileUrl,
      createdAt: serverTimestamp()
    });

    alert("✅ Upload successful! Your PDF is now stored and metadata saved.");
    console.log("Upload complete! File URL:", fileUrl);
    form.reset();

  } catch (err) {
    console.error("Upload error:", err);
    alert("❌ Upload failed. Check console for details.");
  }
});
