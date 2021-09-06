// DOM Elements
const searchWordElem = document.getElementById("search-word");
const searchBtnElem = document.getElementById("sok-button");
const searchTableElem = document.getElementById("search-table");
const tableElement = document.getElementById("search-table");
const tBodyElem = tableElement.querySelector("tbody");

const BASE_LIVSMEDEL_URL =
  "https://webservice.informatik.umu.se/webservice_livsmedel/getlivsmedel.php";

const buildFetchUrl = (searchWord) =>
  `${BASE_LIVSMEDEL_URL}?namn=${searchWord}`;

/**
 * Resources for JSONP fetching in vanilla JS:
 *  https://github.com/camsong/fetch-jsonp/blob/master/src/fetch-jsonp.js
 *  https://gist.github.com/gf3/132080/da50b34e982bcecf7c1376b1eeed35e9f2aacb19
 */
const fetchJSONP = ((unique) => (url) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    const name = `_jsonp_${unique++}`;
    url += url.match(/\?/) ? `&callback=${name}` : `?callback=${name}`;
    script.src = url;
    window[name] = (json) => {
      resolve(new Response(JSON.stringify(json)));
      script.remove();
      delete window[name];
    };
    document.body.appendChild(script);
  }))(0);

const fetchLivsmedel = async (searchWord) => {
  try {
    return await (await fetchJSONP(buildFetchUrl(searchWord))).json();
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

const createNewRow = (livsmedel) => {
  const { energi, fett, kolhydrater, namn, protein } = livsmedel;
  const orderedData = [namn, energi, kolhydrater, protein, fett];
  const row = document.createElement("tr");
  orderedData.forEach((text) => {
    const col = document.createElement("td");
    col.textContent = text;
    row.appendChild(col);
  });
  return row;
};

const populateTable = (data) => {
  data.forEach((livsmedel) => {
    const newRow = createNewRow(livsmedel);
    tBodyElem.appendChild(newRow);
  });
};

const resetTable = () => (tBodyElem.innerHTML = "");

const showTable = (show) =>
  (tableElement.style.visibility = show ? "visible" : "hidden");

const handleSearch = async (e) => {
  e.preventDefault();
  const searchWord = searchWordElem.value;
  const res = await fetchLivsmedel(searchWord);
  if (res.livsmedel && res.livsmedel.length > 0) {
    resetTable();
    showTable(true);
    populateTable(res.livsmedel);
  } else {
    showTable(false);
  }
};

searchBtnElem.addEventListener("click", handleSearch);

document.addEventListener("DOMContentLoaded", () => {
  showTable(false);
});
