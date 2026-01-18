async function loadLayout() {
  const container = document.getElementById("layout-container");
  if (!container) return;

  // ------------------------
  // Load HTML
  // ------------------------
  const response = await fetch("/html/components/layout.html");
  const html = await response.text();
  container.innerHTML = html;
  // AFTER container.innerHTML = html;
import("./header.js").then(module => {
  if (module.initHeader) {
    module.initHeader();
  }
});

  // ------------------------
  // Nav dropdowns
  // ------------------------
  const dropdownItems = container.querySelectorAll(".dropdowns li");
  dropdownItems.forEach(li => {
    li.addEventListener("mouseenter", () => li.classList.add("active"));
    li.addEventListener("mouseleave", () => li.classList.remove("active"));
  });

  // ------------------------
  // Dark mode toggle
  // ------------------------
  const toggleBtn = container.querySelector("#theme-toggle");
  if (toggleBtn) {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
      toggleBtn.textContent = "☀️";
    } else {
      toggleBtn.textContent = "🌙";
    }

    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleBtn.textContent = isDark ? "☀️" : "🌙";
    });
  }

  // ------------------------
  // Firebase auth + profile pic
  // ------------------------
  if (window.auth && window.db) {
    onAuthStateChanged(auth, async (user) => {
      const loginLink = container.querySelector(".login-link");
      const signupLink = container.querySelector(".signup-link");
      const profileLink = container.querySelector(".profile-link");
      const logoutLink = container.querySelector(".logout-link");
      const headerImg = container.querySelector("#header-profile-pic");

      if (user) {
        loginLink.style.display = "none";
        signupLink.style.display = "none";
        profileLink.style.display = "inline-block";
        logoutLink.style.display = "inline-block";

        logoutLink.onclick = () => signOut(auth).then(() => window.location.reload());

        // Load profile pic from Firestore
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        const profileData = userDocSnap.exists() ? userDocSnap.data() : {};
        if (profileData.profilePic) {
          if (headerImg) headerImg.src = profileData.profilePic;
        }
      } else {
        loginLink.style.display = "inline-block";
        signupLink.style.display = "inline-block";
        profileLink.style.display = "none";
        logoutLink.style.display = "none";
      }
    });
  }
}

// ------------------------
// Call after DOM ready
// ------------------------
document.addEventListener("DOMContentLoaded", loadLayout);
document.dispatchEvent(new Event("layout-ready"));
