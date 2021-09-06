// Global variables

// Constants
const SMOOTH_SCROLL_BUTTON_ID = "smooth-scroll-btn";
const SEARCH_INPUT_ID = "live-search-input";
const RECIPE_LINK_CLASSNAME = "recipe-link";
const recipeHeadlineData = [];

// Dynamic variables
let smoothScrollingOn = true;
let searchQuery = "";

// DOM Elements
const recipeMenuElem = document.getElementById("receptmeny");
const menuContentElem = recipeMenuElem.querySelector(".contentarea");
const postElems = document.querySelectorAll(".post");
const topOfPage = document.querySelector(".container");
const recipeListItems = document.querySelectorAll("recipe-link");

/**
 * Queries the DOM for all h4s inside of post elements to retrieve the headlines
 */
const getRecipeHeadlines = () => {
  const recipeHeadlines = [];
  postElems.forEach((post, i) => {
    const headline = post.querySelector("h4").innerText;
    const postId = `post-id-${i}`;
    post.id = postId;
    recipeHeadlines.push(headline);
  });
  return recipeHeadlines;
};

/**
 * Toggles global smoothing variable
 */
const toggleSmoothScrolling = () => (smoothScrollingOn = !smoothScrollingOn);

/**
 * sets up goTo method for recipe links, adds smooth or auto behaviour
 * depending on if smooth scrolling is on
 * @param {string} href - link items href tag
 */
const handleListItemClick = (href) => {
  const offsetTop = document.querySelector(href).offsetTop;
  scroll({
    top: offsetTop,
    behavior: smoothScrollingOn ? "smooth" : "auto",
  });
};

/**
 * Creates a link element for the recipe menu
 * @param {string} headline - link item headline
 * @param {string} href - link items href tag
 */
const createLink = (headline, href) => {
  const listItem = document.createElement("li");
  const anchor = document.createElement("a");
  anchor.className = RECIPE_LINK_CLASSNAME;
  anchor.href = href;
  anchor.innerText = headline;
  listItem.appendChild(anchor);
  listItem.onclick = (e) => {
    e.preventDefault();
    handleListItemClick(href);
  };
  return listItem;
};

/**
 * Creates a unorderlist for the recipe menu
 * @param {string} headline - link itme headline
 * @param {number} i - index
 * @param {DOMElement} unorderedList - unorderlist dom element
 */
const createUnorderdList = (headline, i, unorderedList) => {
  const href = `#post-id-${i}`;
  const listItem = createLink(headline, href);
  unorderedList.appendChild(listItem);
};

/**
 * Filters the recipe headline data on user input in the searchfield
 * @param {HTMLInputElement} e - input event
 */
const liveSearchInputListener = (e) => {
  const unorderedList = document.createElement("ul");
  const links = menuContentElem.querySelectorAll(`.${RECIPE_LINK_CLASSNAME}`);
  links.forEach((node) => {
    node.parentNode.removeChild(node);
  });
  searchQuery = e.target.value.toLowerCase();
  recipeHeadlineData
    .filter((menuItem) => menuItem.toLowerCase().includes(searchQuery))
    .forEach((headline, i) => createUnorderdList(headline, i, unorderedList));
  menuContentElem.appendChild(unorderedList);
};

/**
 * Adds a live search input field to the recipe menu
 */
const addLiveSearchInput = () => {
  const input = document.createElement("input");
  input.autocomplete = "off";
  input.type = "search";
  input.id = SEARCH_INPUT_ID;
  input.placeholder = "Sök efter ett recept";
  input.style.marginBottom = "10px";
  input.addEventListener("input", liveSearchInputListener);
  menuContentElem.prepend(input);
};

/**
 * Populates the recipe menu with links
 * @param {[string]} headlines - array of headlines
 */
const populateMenuWithLinks = (headlines) => {
  const unorderedList = document.createElement("ul");
  headlines.forEach((headline, i) =>
    createUnorderdList(headline, i, unorderedList)
  );
  menuContentElem.appendChild(unorderedList);
};

/**
 * Returns smoothscrolling-buttons innertext
 */
const getSmoothScrollingBtnInnerText = () =>
  `Slå ${!smoothScrollingOn ? "på" : "av"} smooth scrolling`;

/**
 * Updates smoothscrolling buttons text and changes scrollingbehaviour for the
 * links on the recipe menu
 */
const handleSmoothScrollToggle = () => {
  toggleSmoothScrolling();
  // Cant be defined at the top since we initialize it after dom is loaded
  const smoothScrollingBtn = document.getElementById(SMOOTH_SCROLL_BUTTON_ID);
  smoothScrollingBtn.innerText = getSmoothScrollingBtnInnerText();
  recipeListItems.forEach((menuItem) => {
    const href = menuItem.getAttribute("href");
    menuItem.parentNode.onclick = (e) => {
      e.preventDefault();
      handleListItemClick(href);
    };
  });
};

/**
 * Adds a smooth scrolling button to the top of the site
 */
const addSmoothScrollingButton = () => {
  const buttonElem = document.createElement("button");
  buttonElem.id = SMOOTH_SCROLL_BUTTON_ID;
  buttonElem.innerText = getSmoothScrollingBtnInnerText();
  buttonElem.onclick = handleSmoothScrollToggle;
  buttonElem.style.marginTop = "20px";
  topOfPage.prepend(buttonElem);
};

const onDOMContentLoaded = () => {
  const recipeHeadlines = getRecipeHeadlines();
  recipeHeadlineData.push(...recipeHeadlines);
  populateMenuWithLinks(recipeHeadlines);
  addSmoothScrollingButton();
  addLiveSearchInput();
};

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);

