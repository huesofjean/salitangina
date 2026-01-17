const papers = [
  {
    title: "Tumuwid o Mamaluktot: Isang Pagsusuri sa Impluwensiya ng Pandemya",
    category: "Sikolohiya",
    language: "Filipino",
    tags: ["COVID", "Pandemya", "Disiplina"],
    abstract: "Isang pagsusuri sa impluwensiya ng pandemya sa paghubog ng disiplina ng mga estudyante ng Paco Catholic School (PCS).",
    pdf: "../pdfs/impluwensiya-ng-pandemya.pdf"
  },
  {
    title: "EPEKTO NG “TIKTOK” SA PAG-AARAL NG MGA GRADE 11",
    category: "Sikolohiya",
    language: "Filipino",
    tags: ["Edukasyon", "TikTok"],
    abstract: "Isang pag-aaral tungkol sa mga negatibong epekto ng TikTok sa mga kabataan pagdating sa kanilang edukasyon.",
    pdf: "../pdfs/tiktok-sa-pagaaral.pdf"
  },
];

// Container
const cardsContainer = document.getElementById("library-cards");

// Generate cards
function generateCards(papersArray) {
  cardsContainer.innerHTML = "";

  papersArray.forEach(paper => {
    const card = document.createElement("div");
    card.classList.add("paper-card");
    card.dataset.category = paper.category;
    card.dataset.language = paper.language;

    card.innerHTML = `
      <h3>${paper.title}</h3>
      <p><strong>Category:</strong> ${paper.category}</p>
      <p><strong>Language:</strong> ${paper.language}</p>
      <p><strong>Tags:</strong> ${paper.tags.join(", ")}</p>
      <p class="abstract">${paper.abstract}</p>
      <a href="${paper.pdf}" target="_blank" class="download-btn">📄 Download PDF</a>
    `;

    cardsContainer.appendChild(card);
  });
}

// Filter function
function applyFilters() {
  const category = document.getElementById("category-filter").value;
  const language = document.getElementById("language-filter").value;

  const filtered = papers.filter(paper => {
    const categoryMatch = category === "all" || paper.category === category;
    const languageMatch = language === "all" || paper.language === language;
    return categoryMatch && languageMatch;
  });

  generateCards(filtered);
}

// Event listeners
document.getElementById("category-filter").addEventListener("change", applyFilters);
document.getElementById("language-filter").addEventListener("change", applyFilters);

// Initial render
generateCards(papers);
