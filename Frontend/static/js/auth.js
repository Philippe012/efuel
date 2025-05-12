// Session Management
const session = {
  user: null,
  token: null,
  
  init: function() {
      const userData = localStorage.getItem('efuel_user');
      const token = localStorage.getItem('efuel_token');
      
      if (userData && token) {
          this.user = JSON.parse(userData);
          this.token = token;
      }
  },
  
  create: function(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('efuel_user', JSON.stringify(user));
      localStorage.setItem('efuel_token', token);
  },
  
  destroy: function() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('efuel_user');
      localStorage.removeItem('efuel_token');
  },
  
  isAuthenticated: function() {
      return this.token !== null;
  }
};

// Initialize session on load
session.init();

// Protected Route Check
function checkAuth() {
  if (!session.isAuthenticated() && !window.location.pathname.includes('index.html')) {
      window.location.href = 'index.html';
  }
}

// Check auth status on every page load
window.addEventListener('DOMContentLoaded', checkAuth);

// Auth Modal Handling
document.addEventListener('DOMContentLoaded', function() {
  const authModal = document.getElementById('authModal');
  const loginToggle = document.getElementById('loginToggle');
  const signupToggle = document.getElementById('signupToggle');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginNavBtn = document.getElementById('loginNavBtn');
  const signupNavBtn = document.getElementById('signupNavBtn');
  const closeBtn = document.querySelector('.close-btn');

  // Show auth modal
  function showAuthModal(tab = 'login') {
      authModal.style.display = 'block';
      if (tab === 'login') {
          loginToggle.click();
      } else {
          signupToggle.click();
      }
  }

  // Close auth modal
  function closeAuthModal() {
      authModal.style.display = 'none';
  }

  // Tab switching
  loginToggle.onclick = () => {
      loginToggle.classList.add('active');
      signupToggle.classList.remove('active');
      loginForm.classList.add('active');
      signupForm.classList.remove('active');
  };

  signupToggle.onclick = () => {
      signupToggle.classList.add('active');
      loginToggle.classList.remove('active');
      signupForm.classList.add('active');
      loginForm.classList.remove('active');
  };

  // Navigation buttons
  loginNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('login');
  });

  signupNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showAuthModal('signup');
  });

  closeBtn.addEventListener('click', closeAuthModal);
  window.addEventListener('click', (e) => {
      if (e.target === authModal) {
          closeAuthModal();
      }
  });

  // Form submissions
  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
          // Simulate API call
          const response = await mockLogin(email, password);
          
          session.create(response.user, response.token);
          closeAuthModal();
          window.location.href = 'dashboard.html';
      } catch (error) {
          alert(error.message);
      }
  });

  signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;

      if (password !== confirmPassword) {
          alert("Passwords don't match!");
          return;
      }

      try {
          // Simulate API call
          const response = await mockSignup(name, email, password);
          
          session.create(response.user, response.token);
          closeAuthModal();
          window.location.href = 'dashboard.html';
      } catch (error) {
          alert(error.message);
      }
  });
});

// Mock API Functions (replace with real API calls)
async function loginUser(email, password) {
    const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return await response.json(); // Expected: { user, token }
}


async function signupUser(username, email, password) {
    const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: username, email, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
    }

    return await response.json(); // Expected: { user, token }
}
