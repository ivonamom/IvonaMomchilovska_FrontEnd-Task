const cardsContainer = document.querySelector(".preview");

const numberOfColumnsInput = document.querySelector("#numberOfColumns");
const darkThemeInput = document.querySelector("#darkTheme");
const lightThemeInput = document.querySelector("#lightTheme");
const cardBgColorInput = document.querySelector("#cardBackgroundColor");
const loadMoreButton = document.querySelector("#loadMoreButton");
const filterInputs = document.querySelectorAll(".filter input");

numberOfColumnsInput.addEventListener("change", changeNumberOfColumns);
darkThemeInput.addEventListener("change", toggleTheme);
lightThemeInput.addEventListener("change", toggleTheme);
cardBgColorInput.addEventListener("keyup", changeCardBgColor);
loadMoreButton.addEventListener("click", loadMorePosts);
filterInputs.forEach((input) => {
  input.addEventListener("change", filterPosts);
});

let posts = [];
let numberOfPosts = 4;

let likedPosts = [];
const LS_LIKED_KEY = "likedPosts";

let filteredPosts = [];

if (localStorage.getItem(LS_LIKED_KEY)) {
  likedPosts = getFromLS(LS_LIKED_KEY);
}

//fetch data--------------------------------------
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    posts = data;
    filteredPosts = data;
    //initial render
    renderCards(0, 4);
  })
  .catch((error) => console.error(error));

//function that renders cards
function renderCards(start, end) {
  if (!filteredPosts.length) {
    cardsContainer.innerHTML = "<h1>There are no posts from that source.</h1>";
    loadMoreButton.style.display = "none";
    return;
  }
  let slicedArr = [];
  if (numberOfPosts >= filteredPosts.length - 4) {
    slicedArr = filteredPosts.slice(start);
  } else {
    slicedArr = filteredPosts.slice(start, end);
  }
  slicedArr.forEach((post) => {
    const col = createCard({ ...post });
    cardsContainer.appendChild(col);
  });
}

// function for load more
function loadMorePosts() {
  numberOfPosts += 4;
  renderCards(numberOfPosts, numberOfPosts + 4);
  // hiding load more button when all posts are loaded
  if (numberOfPosts >= filteredPosts.length - 4) {
    loadMoreButton.style.display = "none";
  }
}

// function that creates and returns a card
function createCard({
  image,
  caption,
  source_type,
  date,
  likes,
  name,
  profile_image,
}) {
  const col = document.createElement("div");
  col.classList.add("col");
  col.id = caption;

  const card = document.createElement("div");
  card.classList.add("card");

  card.innerHTML = `
    <div>
    <div class="card-header">
      <div class="card-header__left">
        <div class="header-img">
          <img src=${profile_image} alt="Profile image" />
        </div>
        <div class="header-name">
          <h3>${name}</h3>
          <span>${new Date(date).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="card-header__right">
        <img src="/icons/${
          source_type === "instagram" ? source_type + "-logo" : source_type
        }.svg" alt="source logo" />
      </div>
    </div>
<div class="card-body">
<div class="img-container">
  <img src=${image} alt=${caption}>
</div>
<p>${caption}</p>
</div>
    </div>
`;

  let isLiked = !!likedPosts.find(
    (item) =>
      item.caption === caption && item.image === image && item.date === date
  );

  const footer = document.createElement("div");
  footer.classList.add("card-footer");

  const heartCont = document.createElement("div");
  heartCont.classList.add("heart-cont");

  heartCont.innerHTML = `<i class="fa-${
    isLiked ? "solid" : "regular"
  } fa-heart"></i>`;

  const likesSpan = document.createElement("span");
  likesSpan.innerText = isLiked ? +likes + 1 : likes;

  heartCont.removeEventListener("click", toggleLike);
  heartCont.addEventListener("click", toggleLike);

  footer.append(heartCont, likesSpan);
  card.appendChild(footer);
  col.appendChild(card);

  // toggle like

  function toggleLike() {
    isLiked = !isLiked;

    heartCont.innerHTML = `<i class="fa-${
      isLiked ? "solid" : "regular"
    } fa-heart"></i>`;

    if (isLiked) {
      posts = posts.map((post) => {
        //filtering like this because they don't have a unique id
        if (
          post.caption === caption &&
          post.image === image &&
          post.date === date
        ) {
          heartCont.classList.add("liked");
          likesSpan.innerHTML = +post.likes + 1;
          likedPosts.push({ ...post, likes: `${+post.likes + 1}` });

          return {
            ...post,
            likes: `${+post.likes + 1}`,
          };
        }
        return post;
      });
    } else {
      posts = posts.map((post) => {
        if (
          post.caption === caption &&
          post.image === image &&
          post.date === date
        ) {
          heartCont.classList.remove("liked");
          likesSpan.innerHTML = +post.likes - 1;
          likedPosts = likedPosts.filter((post) => post.caption !== caption);

          return {
            ...post,
            likes: `${+post.likes - 1}`,
          };
        }
        return post;
      });
    }
    saveToLS(LS_LIKED_KEY, likedPosts);
  }

  return col;
}

//function to change number of columns ----------------------
function changeNumberOfColumns(ev) {
  const flexBasis = 100 / ev.target.value;

  if (window.innerWidth > 992) {
    const columns = document.querySelectorAll(".col");
    columns.forEach((column) => {
      column.style.flexBasis = `${flexBasis}%`;
    });
  }
}
//function to change card bg---------------------------------------------------
function changeCardBgColor(ev) {
  if (ev.key === "Enter") {
    const cards = document.querySelectorAll(".card");
    const color = ev.target.value;

    cards.forEach((card) => {
      card.style.backgroundColor = color;
      if (isLight(color)) {
        card.style.color = "#333";
      } else {
        card.style.color = "#fff";
      }
    });
  }
}

//function to toggle theme--------------------------------------------------
function toggleTheme(ev) {
  const root = document.documentElement;
  const theme = ev.target.id;

  if (theme === "darkTheme") {
    root.classList.add("dark-theme");
  } else {
    root.classList.remove("dark-theme");
  }
}

// function to filter cards------------------
function filterPosts(ev) {
  const value = ev.target.value;
  console.log(ev);
  if (value.toLowerCase() === "all") {
    filteredPosts = posts;
  } else {
    filteredPosts = posts.filter(
      (post) => post.source_type.toLowerCase() === value.toLowerCase()
    );
  }

  cardsContainer.innerHTML = "";
  numberOfPosts = 4;
  renderCards(0, 4);
}

//HELPER FUNCTIONS --------------------

//helper function for saving data to LS
function saveToLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

//helper function for getting data from LS
function getFromLS(key) {
  return JSON.parse(localStorage.getItem(key));
}

//helper function that returns a unique id
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//helper function to determine lightness of bg color
function isLight(color) {
  const hex = color.replace("#", "");
  const c_r = parseInt(hex.substring(0, 0 + 2), 16);
  const c_g = parseInt(hex.substring(2, 2 + 2), 16);
  const c_b = parseInt(hex.substring(4, 4 + 2), 16);
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
  return brightness > 100;
}
