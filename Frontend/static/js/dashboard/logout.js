
// Add this to your dashboard.js or a new auth section
document.addEventListener('DOMContentLoaded', function() {
    // Initialize session
    const session = {
        user: JSON.parse(localStorage.getItem('efuel_user')),
        token: localStorage.getItem('efuel_token')
    };

    // Update UI with user data
    if (session.user) {
        const userAvatar = document.querySelector('.user-avatar');
        const userName = document.querySelector('.user-name');
        
        // Update avatar with user's first letter if no image
        if (!userAvatar.src.includes('ui-avatars.com')) {
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name)}&background=4361ee&color=fff`;
        }
        
        userName.textContent = session.user.name;
    }

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear session
        localStorage.removeItem('efuel_user');
        localStorage.removeItem('efuel_token');
        
        // Redirect to login page with no history back
        window.location.replace('signin.html');
    });

    // Prevent back navigation after logout
    window.addEventListener('popstate', function() {
        if (!localStorage.getItem('efuel_token')) {
            window.location.replace('signin.html');
        }
    });
});

// Add this to your existing quickActions.js
document.getElementById('findStationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        // ... existing find station code ...
    } else {
        alert("Geolocation is not supported by your browser");
    }
});