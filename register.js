// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();

  // Gather form data
  const formData = new FormData(event.target);
  const data = {
    name: formData.get("username"),
    email: formData.get("email"),
    avatar: formData.get("avatar"),
    password: formData.get("password"),
  };

  // Post data to the API
  fetch("https://api.noroff.dev/api/v1/auction/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.id) {
        alert("Registration successful!");
        window.location.href = "login.html";
      } else {
        alert(data.errors[0].message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while registering. Please try again.");
    });
}

// Attach the event listener to your form when the window loads
window.addEventListener("load", () => {
  document.querySelector("form").addEventListener("submit", handleSubmit);
});
