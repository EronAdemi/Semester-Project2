document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = loginForm.querySelector('input[name="email"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    const data = { email, password };

    fetch("https://api.noroff.dev/api/v1/auction/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("name", data.name);

          alert("Login successful!");
          window.location.href = "index.html";
        } else {
          alert(data.errors[0].message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Login Failed: " + error.message);
      });
  });
});
