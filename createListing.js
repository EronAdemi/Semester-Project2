const newAuction = document.getElementById("new-auction");
const accessToken = localStorage.getItem("accessToken");

const postListing = async (formData) => {
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/auction/listings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    console.log("response data", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const newAuctionButton = document.getElementById("new-auction");

  if (newAuctionButton) {
    newAuctionButton.addEventListener("click", function () {
      document.getElementById("newAuctionModal").classList.remove("hidden");
    });
  }

  const newAuctionForm = document.getElementById("newAuctionForm");
  if (newAuctionForm) {
    newAuctionForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const tagsInput = document.getElementById("tags").value;
      const tagsArray = tagsInput.split(",").map((tag) => tag.trim());
      //    .filter((tag) => tag !== "");

      const formData = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        endsAt: new Date(document.getElementById("endsAt").value).toISOString(),
        tags: tagsArray,
        media: document.getElementById("media").value,
      };

      await postListing(formData);
      closeModal();
    });
  }

  window.closeModal = function () {
    document.getElementById("newAuctionModal").classList.add("hidden");
  };
});
