document.addEventListener("DOMContentLoaded", function () {
  const name = localStorage.getItem("name");
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    window.location.href = "login.html";
  }
  fetchProfileData(accessToken, name);
  fetchProfileListingData(accessToken, name);
  document.getElementById("edit").addEventListener("click", function () {
    document.getElementById("editModal").classList.remove("hidden");
  });
});

document
  .getElementById("submitAvatar")
  .addEventListener("click", async function () {
    const avatarUrl = document.getElementById("avatarUrl").value;
    const name = localStorage.getItem("name");
    if (avatarUrl && name) {
      await updateAvatar(name, avatarUrl);
    }
  });

const updateAvatar = async (name, url) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({ avatar: url }),
  };
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/profiles/${name}/media`,
      options
    );
    window.location.reload();
    if (!response.ok) {
      console.log(name);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Avatar updated:", data);
    document.getElementById("avatar").textContent = data.avatar;

    document.getElementById("editModal").classList.add("hidden");
  } catch (error) {
    console.error("Error updating avatar:", error);
  }
};

const fetchProfileData = async (accessToken, name) => {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await fetch(
    `https://api.noroff.dev/api/v1/auction/profiles/${name}`,
    options
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.name) {
    window.location.href = "login.html";
  } else {
    document.getElementById("name").textContent = data.name;
    document.getElementById("email").textContent = data.email;
    document.getElementById("credit").textContent = data.credits;
    document.getElementById("avatar").src = data.avatar;
  }
  return data;
};

const fetchProfileListingData = async (accessToken, name) => {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await fetch(
    `https://api.noroff.dev/api/v1/auction/profiles/${name}/listings`,
    options
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.statusText}`);
  }
  const data = await response.json();
  console.log(data);
  data.forEach((item) => {
    auctionListings.appendChild(createCard(item));
  });
  return data;
};

const logoutElement = document.getElementById("logout");
const navLogoutElement = document.getElementById("navLogout");

if (logoutElement) {
  logoutElement.addEventListener("click", logout);
}
if (navLogoutElement) {
  navLogoutElement.addEventListener("click", logout);
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("name");
  window.location.reload();
}

function createCard(item) {
  const card = document.createElement("div");
  card.className =
    "card w-80 h-[450px] bg-white px-3 py-2 rounded-lg shadow-md";

  const defaultImageUrl = "./assets/no-image.jpg";
  const imageSrc = item.media?.length > 0 ? item.media[0] : defaultImageUrl;
  const images = `<img class="w-full h-52 object-cover rounded-t-lg" src="${imageSrc}" alt="${item.title}">`;

  const title = `<h3 class="text-lg font-semibold mt-2">${item.title}</h3>`;
  const divider = `<hr class="my-2">`;
  const bids = `<p class="font-semibold"> <span class="!text-green-500 font-bold">Current Bid:</span> $${item._count?.bids}</p>`;

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
  }

  const endsAt = `<p class="font-bold">Time Left: <span style="color: ${timeLeftColor}">${timeLeftString}</span> </p>`;

  card.innerHTML = `${images}<div class="px-2 w-64">${title}${divider}${bids}${divider}${endsAt}</div>`;

  const auctionListings = document.getElementById("auctionListings");

  return card;
}
