const API_KEY = "ce7e3dcbeae94143a42aa8ef5b1b6a29";
const countrySelect = document.getElementById("countrySelect");
const newsContainer = document.getElementById("newsContainer");
const searchIcon = document.getElementById("searchIcon");
const inputText = document.getElementById("inputText");
const requestError = document.getElementById("requestError");
const loadingContainer = document.getElementById("loadingContainer");

let country = countrySelect.value;
let selectedOptionText =
  countrySelect.options[countrySelect.selectedIndex].textContent;
let query = selectedOptionText.replace(/\s/g, "");
let apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;

function fetchNews(url) {
  newsContainer.innerHTML = "";
  loadingContainer.classList.remove("d-none");

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error("Error while fetching");
      }
      return response.json();
    })
    .then((jsonData) => {
      jsonData.articles.forEach((article) => articleCard(article));
      loadingContainer.classList.add("d-none");
      errorRender("none");
    })
    .catch((error) => {
      errorRender("flex", error.message);
      loadingContainer.classList.add("d-none");
      console.error("Error:", error.message);
    });
}

function articleCard(article) {
  const {
    author,
    content,
    description,
    publishedAt,
    source,
    title,
    url,
    urlToImage,
  } = article;
  const date = new Date(publishedAt);
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  const articleCardContainer = document.createElement("div");
  articleCardContainer.classList.add("article-card-container");
  articleCardContainer.innerHTML = `
    <div class="article-image-container">
      <img src="${
        urlToImage || "./images/default.jpg"
      }" class="article-image" alt="No Image">
    </div>
    <div class="article-content-container">
      <h1 class="article-title">${title}</h1>
      <p class="article-content">${content}</p>
      <div class="article-details-container">
        <a href="${url}" class="read-more-btn" target="__blank">Read More</a>
        <p class="publisher-name">${source.name}</p>
        <p class="published-content">Published At: ${formattedDate}</p>
      </div>
    </div>
  `;
  newsContainer.appendChild(articleCardContainer);
}

function errorRender(visibility, errorMsg = "") {
  requestError.innerHTML = `<p>${errorMsg}</p>`;
  requestError.style = `
  display : ${visibility};
  justify-content:center;
  align-items:center;
  height : 100%;
  width : 100%;
  font-size : 14px;
  font-weight :500;
  `;
}

function performSearch() {
  const inputValue = inputText.value;
  apiUrl = `https://newsapi.org/v2/everything?q=${inputValue}&apiKey=${API_KEY}`;
  fetchNews(apiUrl);
}

searchIcon.addEventListener("click", performSearch);

inputText.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

countrySelect.addEventListener("change", () => {
  country = countrySelect.value;
  selectedOptionText =
    countrySelect.options[countrySelect.selectedIndex].textContent;
  query = selectedOptionText.replace(/\s/g, "");
  document.getElementById("countryName").textContent = selectedOptionText;
  apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}`;
  fetchNews(apiUrl);
});

function articleCategories() {
  const targetItems = document.querySelectorAll(".news-type-item");
  targetItems.forEach((item) => {
    item.onclick = (e) => {
      category = e.target.textContent;

      if (category === "General") {
        apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}`;
      } else if (category === selectedOptionText) {
        apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
      } else {
        apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}`;
      }

      fetchNews(apiUrl);
    };
  });
}
articleCategories();

fetchNews(apiUrl);
