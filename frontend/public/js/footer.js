fetch("/html/components/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-placeholder").innerHTML = html;
  })
  .catch(err => console.error("Footer failed to load:", err));
