function updateUIBasedOnAccessToken() {
  const loginElement = document.getElementById("login");
  const logoutElement = document.getElementById("logout");
  const profileElement = document.getElementById("profile");

  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    logoutElement.style.display = "block";
    profileElement.style.display = "block";
    loginElement.style.display = "none";
  } else {
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

function displayData(data) {
  const container = document.getElementById("details-container");
  container.className = "flex flex-col items-center w-7/12";
  container.innerHTML = "";

  const imgContainer = document.createElement("div");
  imgContainer.className = "w-full mx-auto";
  container.appendChild(imgContainer);

  if (data.media?.length > 0) {
    const img = document.createElement("img");
    img.src = data.media[0];
    img.alt = data.title;
    img.className = "w-full h-auto";
    imgContainer.appendChild(img);
  }

  const title = document.createElement("h2");
  title.textContent = data?.title;
  title.className = "text-5xl align-left text-white";
  container.appendChild(title);

  const divider = document.createElement("hr");
  divider.className = "border-t border-white my-3 w-full";
  container.appendChild(divider);

  const description = document.createElement("p");
  description.textContent = data?.description;
  description.className = "text-white";
  container.appendChild(description);

  document.getElementById("current-price").textContent = data.bids.reduce(
    (max, bid) => {
      return bid.amount > max ? bid.amount : max;
    },
    0
  );

  data.bids.forEach((bid) => {
    const row = document.createElement("div");
    row.className =
      "grid grid-cols-4 gap-4 p-2 text-center border-b border-black";

    const bidderDiv = document.createElement("div");
    bidderDiv.textContent = bid.bidderName;
    row.appendChild(bidderDiv);

    const dateDiv = document.createElement("div");
    dateDiv.textContent = new Date(bid.created).toLocaleDateString();
    row.appendChild(dateDiv);

    const timeDiv = document.createElement("div");
    timeDiv.textContent = new Date(bid.created).toLocaleTimeString();
    row.appendChild(timeDiv);

    const amountDiv = document.createElement("div");
    amountDiv.textContent = `$${bid.amount}`;
    row.appendChild(amountDiv);

    const bidsTableSection = document.getElementById("table");
    bidsTableSection.appendChild(row);
  });

  const endTime = new Date(data?.endsAt);
  const currentTime = new Date();
  const timeLeft = endTime - currentTime;

  let timeLeftString,
    timeLeftColor = "black";
  if (timeLeft < 0) {
    timeLeftString = "Auction ended";
    timeLeftColor = "red";
  } else {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    timeLeftString = `${days}d: ${hours}h: ${minutes}m: ${seconds}s`;
  }
  const endsAt = document.getElementById("endsIn");
  endsAt.textContent = timeLeftString;
}

let urlString = window.location.href;
let url = new URL(urlString);
let params = new URLSearchParams(url.search);
let id = params.get("id");

const fetchProductDetails = async (id) => {
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/listings/${id}?_bids=true`
    );
    const data = await response.json();
    console.log(data);
    displayData(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

fetchProductDetails(id);

document.getElementById("submit").addEventListener("click", async function () {
  const bidInputValue = document.getElementById("bidAmount").value;
  const bid = parseFloat(bidInputValue);
  if (isNaN(bid)) {
    alert("Please enter a valid number for the bid");
    return;
  }

  console.log(bid);
  let urlString = window.location.href;
  let url = new URL(urlString);
  let params = new URLSearchParams(url.search);
  let id = params.get("id");
  await updateBid(id, bid);
  await fetchProductDetails(id);
});

const updateBid = async (id, bid) => {
  if (localStorage.getItem("accessToken") === null) {
    return alert("Please login to bid");
  }
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({ amount: bid }),
  };
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/listings/${id}/bids?_bids=true`,
      options
    );
    const data = await response.json();
    if (!data.id) {
      alert(data.errors[0].message);
    }
    console.log("bid updated:", data);
  } catch (error) {
    console.error("Error updating bid:", error);
  }
};

window.onload = function () {
  updateUIBasedOnAccessToken();
};
