document.addEventListener('DOMContentLoaded', () => {
  // Contact form handler (your existing code)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Show loading message
      formStatus.innerHTML = '<p>Sending your message...</p>';
      formStatus.style.display = 'block';
      
      // Get form data
      const formData = new FormData(contactForm);
      const data = {};
      
      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      // Create URL-encoded form data string
      const urlEncodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');
      
      // Google script API to connect to the database
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxi42yMdN9OmPOA150EYn7nEsPebSbVeoQmG5p02c4rJHfhXWzmpD_9EW82bZsDfO_Syw/exec';
      
      // Submit the form
      fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncodedData
      })
      .then(response => response.json())
      .then(data => {
        if (data.result === 'success') {
          // Show success message
          formStatus.innerHTML = '<p class="success">Thank you! Your message has been sent.</p>';
          // Reset the form
          contactForm.reset();
        } else {
          // Show error message
          formStatus.innerHTML = `<p class="error">Error: ${data.message}</p>`;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        formStatus.innerHTML = '<p class="error">Something went wrong. Please try again later.</p>';
      });
    });
  }
  
  // FIXED CODE: Sign-in form handler
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    // Create status container if it doesn't exist
    let loginStatusContainer = document.querySelector('.login-status');
    if (!loginStatusContainer) {
      loginStatusContainer = document.createElement('div');
      loginStatusContainer.className = 'login-status';
      loginStatusContainer.style.display = 'none';
      loginForm.appendChild(loginStatusContainer);
    }

    // Prevent the default form action that might be causing validation issues
    loginForm.setAttribute('novalidate', '');
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Manual validation
      const emailInput = loginForm.querySelector('input[name="username"]');
      const passwordInput = loginForm.querySelector('input[name="password"]');
      
      // Check if fields are empty
      if (!emailInput.value || !passwordInput.value) {
        loginStatusContainer.innerHTML = '<p class="error">Please fill in all required fields.</p>';
        loginStatusContainer.style.display = 'block';
        return;
      }
      
      // Show loading message
      loginStatusContainer.innerHTML = '<p>Signing in...</p>';
      loginStatusContainer.style.display = 'block';
      
      // Get form data
      const formData = new FormData(loginForm);
      const data = {};
      
      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        data[key] = value;
      }
      
      // Create URL-encoded form data string
      const urlEncodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');
      
      // Google script API to connect to the database
      const scriptURL = 'https://script.google.com/macros/s/AKfycbxi42yMdN9OmPOA150EYn7nEsPebSbVeoQmG5p02c4rJHfhXWzmpD_9EW82bZsDfO_Syw/exec';
      
      // Submit the form
      fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncodedData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.result === 'success') {
          // Show success message
          loginStatusContainer.innerHTML = '<p class="success">Successfully signed in!</p>';
          
          // Optional: redirect after a delay
          setTimeout(() => {
            window.location.href = "#Home"; // Redirect to home section
            document.querySelector('.login-form-container').classList.remove('active');
          }, 1500);
        } else {
          // Show error message
          loginStatusContainer.innerHTML = `<p class="error">Error: ${data.message || 'Invalid credentials'}</p>`;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        loginStatusContainer.innerHTML = '<p class="error">Something went wrong. Please try again later.</p>';
      });
    });
  }
  
  // Close login form when close button is clicked
  const closeLoginBtn = document.getElementById('close-login-btn');
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
      document.querySelector('.login-form-container').classList.remove('active');
    });
  }
  
  // Open login form when user icon is clicked
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.login-form-container').classList.add('active');
    });
  }
  
  // Add some CSS for the login status messages
  const style = document.createElement('style');
  style.textContent = `
    .login-status {
      margin-top: 20px;
      padding: 10px;
      border-radius: 4px;
    }
    .login-status .success {
      color: #28a745;
    }
    .login-status .error {
      color: #dc3545;
    }
    .login-form-container {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    .login-form-container.active {
      display: flex;
    }
  `;
  document.head.appendChild(style);
});