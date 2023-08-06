const API_KEY = "a0d825f8e1ce4741b03067a47838cfa8";
// const API_KEY = "1a83dd93a2024e5dafc4096878f9aa83";
// const API_KEY = "3d585ef3352247d783f9add830b0014c";

let countrySelect = document.getElementById("countrySelect");
let country = countrySelect.value;

let selectedOptionText = countrySelect.options[countrySelect.selectedIndex].textContent;
let query = selectedOptionText.replace(/\s/g, "");


function articleCard(articles){
    let {author, content, description, publishedAt, source,title, url, urlToImage} = articles;
    let {name} = source;

    let newsContainer = document.getElementById("newsContainer");

    let articleCardContainer = document.createElement("div");
    articleCardContainer.classList.add("article-card-container");
    newsContainer.appendChild(articleCardContainer);


    articleCardContainer.innerHTML = 
    `<div class="article-image-container">
        <img src="${urlToImage}" class="article-image">
    </div>
    <div class="article-content-container">
        <h1 class="article-title">${title}</h1>
        <p class="article-content">
            ${content}
        </p>
        <div class="article-details-container">
            <a href="${url}" class="read-more-btn" target="__blank">
                Read More
            </a>
            <p class="publisher-name">
                ${name}
            </p>
            <p class="published-content">
                Published At: ${publishedAt}
            </p>
        </div>
    </div>
    `

    let hrLine = document.createElement("hr");
    newsContainer.appendChild(hrLine);
}


let  fetchNews = async (apiUrl) =>{
    document.getElementById("newsContainer").innerHTML = "";
    document.getElementById('loadingContainer').classList.remove('d-none');

    try {
        var req = new Request(apiUrl);
        let response = await fetch(req);
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        let jsonData = await response.json();
        let articles = jsonData.articles;
        for (let eachArticle of articles) {
        articleCard(eachArticle);
        }
        document.getElementById('loadingContainer').classList.add('d-none');
    } catch (e) {
        console.log('Error:', e);
    }
  
}


function search() {
    const searchIcon = document.getElementById("searchIcon");
    const inputText = document.getElementById("inputText");
  
    function performSearch() {
      let inputValue = inputText.value;
      apiUrl = `https://newsapi.org/v2/everything?q=${inputValue}&apiKey=${API_KEY}`;
      fetchNews(apiUrl);
    }
  
    searchIcon.addEventListener("click", (e) => {
      performSearch();
    });
  
    inputText.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        performSearch();
      }
    });
}
search();
  


function articleCategories(){  
    const targetItems = document.querySelectorAll('.news-type-item');
    targetItems.forEach(item => {
        item.onclick = (e) => {
            category = e.target.textContent;

            if(category === "General"){
                apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${API_KEY}`;
            }else if(category === selectedOptionText){
                apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
            }else{
                apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}`
            }

            fetchNews(apiUrl);
        };
    });
}
articleCategories();


function countryChange(){

    countrySelect.addEventListener("change", (e)=>{
        country = countrySelect.value;

        selectedOptionText = countrySelect.options[countrySelect.selectedIndex].textContent;
        query = selectedOptionText.replace(/\s/g, "");

        document.getElementById("countryName").textContent = selectedOptionText;
        apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
        fetchNews(apiUrl);
    })
}
countryChange();

// active tab change //
const newsTypeItems = document.querySelectorAll(".news-type-item");

newsTypeItems.forEach(item => {
  item.addEventListener("click", () => {
    const clickedIndex = Array.from(newsTypeItems).indexOf(item);
    const activeIndex = Array.from(newsTypeItems).findIndex(item => item.classList.contains("active"));
    if (activeIndex !== -1 && activeIndex !== clickedIndex) {
      newsTypeItems[activeIndex].classList.remove("active");
    }
    item.classList.add("active");;
  });
});



apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;
fetchNews(apiUrl);
