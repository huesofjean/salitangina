import { auth } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    // 🚫 Not logged in
    if (!user) {
        alert("Kailangan mong mag-log in upang makapag-upload.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Logged in → no role check needed
    // All logged-in users can access upload page
});
