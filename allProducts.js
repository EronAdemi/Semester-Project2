let currentIndex = 6;
let isSortNewest = true;

function fetchData() {
  fetch("https://api.noroff.dev/api/v1/auction/listings?_bids=true")
    .then((response) => response.json())
    .then((data) => {
      const auctionListings = document.getElementById("auctionListings");
      auctionListings.innerHTML = "";
      console.log(data.reverse());
      if (isSortNewest) {
        data.reverse();
      }

      const initialLoadItems = data.slice(0, 6);
      initialLoadItems.forEach((item) => {
        auctionListings.appendChild(createCard(item));
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
}

document.getElementById("submitSearch").addEventListener("click", function () {
  const searchQuery = document.getElementById("searchBar").value;
  console.log(searchQuery);
  fetch(`https://api.noroff.dev/api/v1/auction/listings?_tag=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      const auctionListings = document.getElementById("auctionListings");
      console.log(data);
      auctionListings.innerHTML = "";
      if (data.length === 0) {
        auctionListings.innerHTML = `<h1 class="text-2xl text-center">No results found</h1>`;
      }
      data.forEach((item) => {
        auctionListings.appendChild(createCard(item));
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});

// Add event listener for the sort button
document
  .getElementById("sortButton")
  .addEventListener("click", toggleSortOrder);
toggleSortOrder();

// Existing showMoreButton listener
document
  .getElementById("showMoreButton")
  .addEventListener("click", function () {
    fetch("https://api.noroff.dev/api/v1/auction/listings")
      .then((response) => response.json())
      .then((data) => {
        loadMoreItems(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  });

function loadMoreItems(data) {
  if (isSortNewest) {
    data.reverse();
  }
  const nextItems = data.slice(currentIndex, currentIndex + 6);
  currentIndex += 6;
  const auctionListings = document.getElementById("auctionListings");
  nextItems.forEach((item) => {
    auctionListings.appendChild(createCard(item));
  });
}

document
  .getElementById("showMoreButton")
  .addEventListener("click", function () {
    fetch("https://api.noroff.dev/api/v1/auction/listings")
      .then((response) => response.json())
      .then((data) => {
        loadMoreItems(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  });

function toggleSortOrder() {
  isSortNewest = !isSortNewest;
  const sortButton = document.getElementById("sortButton");
  sortButton.textContent = isSortNewest ? "Oldest" : "Newest";
  fetchData();
  updateSortButtonLabel();
}

function updateSortButtonLabel() {
  const sortButton = document.getElementById("sortButton");
  sortButton.textContent = isSortNewest ? "Oldest" : "Newest";
}

function createCard(item) {
  const card = document.createElement("div");
  card.className =
    "card w-80 h-[450px] bg-white px-3 py-2 rounded-lg shadow-md";

  const defaultImageUrl = "./assets/no-image.jpg";
  const imageSrc = item.media.length > 0 ? item.media[0] : defaultImageUrl;
  const images = `<img class="w-full h-52 object-cover rounded-t-lg" src="${imageSrc}" alt="${item.title}">`;

  const title = `<h3 class="text-lg font-semibold mt-2">${item.title}</h3>`;
  const divider = `<hr class="my-2">`;
  let bid = item.bids?.reduce((max, bid) => {
    return bid.amount > max ? bid.amount : max;
  }, 0);
  const bids = `<p class="font-semibold"> <span class="!text-green-500 font-bold">Current Bid:</span> $${bid}</p>`;

  const endTime = new Date(item.endsAt);
  const currentTime = new Date();
  const timeLeft = endTime - currentTime;

  let timeLeftString,
    submitButton = "",
    timeLeftColor = "black";
  if (timeLeft < 0) {
    timeLeftString = "Auction ended";
    timeLeftColor = "red"; // Red color for ended auctions
  } else {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    timeLeftString = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;

    // Only show submit button if auction is still active
    submitButton = `<div class="flex justify-center mt-8 w-36 m-auto ">
                    <a class="bg-[#3B3C50] text-white font-bold py-1 px-7 shadow-lg rounded-lg" href='productDetails.html?id=${item.id}'>Submit Bid</a>
                    </div>`;
  }

  const endsAt = `<p class="font-bold">Time Left: <span style="color: ${timeLeftColor}">${timeLeftString}</span> </p>`;

  card.innerHTML = `${images}<div class="px-2 w-64">${title}${divider}${bids}${divider}${endsAt}${submitButton}</div>`;
  return card;
}

function updateUIBasedOnAccessToken() {
  const loginElement = document.getElementById("login");
  const logoutElement = document.getElementById("logout");
  const profileElement = document.getElementById("profile");

  // Check if accessToken is present in local storage
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    // If accessToken is present, show logout and profile, hide login
    logoutElement.style.display = "block";
    profileElement.style.display = "block";
    loginElement.style.display = "none";
  } else {
    // If accessToken is not present, show login, hide logout and profile
    loginElement.style.display = "block";
    logoutElement.style.display = "none";
    profileElement.style.display = "none";
  }
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("name");
  updateUIBasedOnAccessToken();
}

const logoutElement = document.getElementById("logout");
if (logoutElement) {
  logoutElement.addEventListener("click", logout);
}

window.onload = function () {
  fetchData();
  updateUIBasedOnAccessToken();
};
