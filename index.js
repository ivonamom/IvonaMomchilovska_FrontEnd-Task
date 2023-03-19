const cardsContainer = document.querySelector(".preview");

const numberOfColumnsInput = document.querySelector("#numberOfColumns");
const cardSpaceBetweenInput = document.querySelector("#cardSpaceBetween");
const darkThemeInput = document.querySelector("#darkTheme");
const lightThemeInput = document.querySelector("#lightTheme");
const cardBgColorInput = document.querySelector("#cardBackgroundColor");
const filterInputs = document.querySelectorAll(".filter input");
const loadMoreButton = document.querySelector("#loadMoreButton");

numberOfColumnsInput.addEventListener("change", changeNumberOfColumns);
cardSpaceBetweenInput.addEventListener("keyup", changeCardSpaceBetween);
darkThemeInput.addEventListener("change", toggleTheme);
lightThemeInput.addEventListener("change", toggleTheme);
cardBgColorInput.addEventListener("keyup", onColorInputKeyup);
filterInputs.forEach((input) => {
  input.addEventListener("change", filterPosts);
});
loadMoreButton.addEventListener("click", loadMorePosts);

let numberOfPosts = 4;

//array containing all posts
let posts = [];
const LS_POSTS_KEY = "allPosts";

//array containing only the likes posts
let likedPosts = [];
const LS_LIKED_KEY = "likedPosts";

// array that contains the posts that should be displayed
let filteredPosts = [];

if (localStorage.getItem(LS_LIKED_KEY)) {
  likedPosts = getFromLS(LS_LIKED_KEY);
}

//if the array is saved to LS - take it from there
//otherwise fetch it from the data.json

//only reason for doing this is to use my updated version of the array with the unique ids because they were not provided - this would NOT be the case in a realistic scenario

if (getFromLS(LS_POSTS_KEY)) {
  posts = getFromLS(LS_POSTS_KEY);
  filteredPosts = posts;
  //initial render
  renderCards(0, 4);
} else {
  //fetch data--------------------------------------
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const editedData = data.map((post) => {
        return {
          ...post,
          id: uuidv4(),
        };
      });
      saveToLS(LS_POSTS_KEY, editedData);
      posts = editedData;
      filteredPosts = editedData;
      //initial render
      renderCards(0, 4);
    })
    .catch((error) => console.error(error));
}

//function that renders cards
function renderCards(start, end) {
  if (!filteredPosts.length) {
    cardsContainer.innerHTML = "<h1>There are no posts from that source.</h1>";
    loadMoreButton.style.display = "none";
    return;
  }
  //slicing the array so only the needed 4 posts are additionally rendered
  let slicedArr = [];
  if (numberOfPosts >= filteredPosts.length - 4) {
    slicedArr = filteredPosts.slice(start);
  } else {
    slicedArr = filteredPosts.slice(start, end);
  }
  slicedArr.forEach((post) => {
    const card = createCard({ ...post }, "card");
    cardsContainer.appendChild(card);
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

  //change color bg on the new cards too according to the value in input
  changeCardBgColor();
}

// function that creates and returns a card
function createCard(
  { image, caption, source_type, date, likes, name, profile_image, id },
  type
) {
  const card = document.createElement("div");
  card.classList.add(`${type === "card" ? "card" : "pop-up"}`);

  const popUp = document.querySelector(".pop-up");
  card.addEventListener("click", () => {
    popUp.style.display = "block";
  });

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

  //boolean value that shows if post is liked
  let isLiked = !!likedPosts.find((item) => item.id === id);

  const footer = document.createElement("div");
  footer.classList.add("card-footer");

  const heartCont = document.createElement("div");
  heartCont.classList.add("heart-cont");

  heartCont.innerHTML = `<i class="fa-${
    isLiked ? "solid" : "regular"
  } fa-heart"></i>`;

  const likesSpan = document.createElement("span");
  likesSpan.innerText = likes;

  heartCont.removeEventListener("click", toggleLike);
  heartCont.addEventListener("click", toggleLike);

  footer.append(heartCont, likesSpan);
  card.appendChild(footer);

  // toggle like

  function toggleLike() {
    isLiked = !isLiked;

    heartCont.innerHTML = `<i class="fa-${
      isLiked ? "solid" : "regular"
    } fa-heart"></i>`;

    //regardless of whether the action was liking or disliking the post - change the like count, update the original array with the updated likes and add post to the liked posts array
    if (isLiked) {
      posts = posts.map((post) => {
        if (post.id === id) {
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
        if (post.id === id) {
          likesSpan.innerHTML = +post.likes - 1;
          likedPosts = likedPosts.filter((post) => post.id !== id);

          return {
            ...post,
            likes: `${+post.likes - 1}`,
          };
        }
        return post;
      });
    }
    saveToLS(LS_LIKED_KEY, likedPosts);
    saveToLS(LS_POSTS_KEY, posts);
  }

  //returns the created card with the values given to it as parameters
  return card;
}

//function to change number of columns ----------------------
function changeNumberOfColumns(ev) {
  const columns = ev.target.value;

  if (columns === "dynamic") {
    //returns value to default
    cardsContainer.style.gridTemplateColumns = `repeat(3, 1fr)`;
    return;
  }

  if (window.innerWidth > 992) {
    cardsContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
}
// function to change the gap between the cards------------------------------
function changeCardSpaceBetween(ev) {
  if (ev.key === "Enter") {
    const value = ev.target.value;

    if (value === "") {
      cardSpaceBetweenInput.value = "10px";
      cardsContainer.style.gridColumnGap = "10px";
      cardsContainer.style.gridRowGap = "10px";
      return;
    }

    cardsContainer.style.gridColumnGap = value;
    cardsContainer.style.gridRowGap = value;
  }
}

// function for ColorInput
function onColorInputKeyup(ev) {
  if (ev.key === "Enter") {
    changeCardBgColor();
  }
}

// function to change card bg---------------------------------------------------
function changeCardBgColor() {
  const cards = document.querySelectorAll(".card");
  const color = cardBgColorInput.value;

  cards.forEach((card) => {
    card.style.backgroundColor = color;
    if (isLight(color)) {
      card.style.color = "#333";
    } else {
      card.style.color = "#fff";
    }
  });
}

//function to toggle theme--------------------------------------------------
function toggleTheme(ev) {
  const root = document.documentElement;
  const theme = ev.target.id;

  if (theme === "darkTheme") {
    root.classList.add("dark-theme");
    if (cardBgColorInput.value === "#ffffff") {
      cardBgColorInput.value = "#333";
    }
  } else {
    root.classList.remove("dark-theme");
    if (cardBgColorInput.value === "#333") {
      cardBgColorInput.value = "#ffffff";
    }
  }
}

// function to filter cards------------------
function filterPosts(ev) {
  const value = ev.target.value;
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
  //change color bg on the new cards too according to the value in input
  changeCardBgColor();
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
