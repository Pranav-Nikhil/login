document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message');

  fetch('/login', { // Send to /login endpoint on the server
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }) // Send data as JSON
  })
  .then(response => response.json())
  .then(data => {
      if (data.message === "Login successful!") {
          messageDiv.textContent = data.message;
          window.location.href = "/welcome"; // Redirect or other actions
      } else {
          messageDiv.textContent = data.message;
      }
  })
  .catch(error => {
      console.error("Error:", error);
      messageDiv.textContent = "An error occurred.";
  });
});