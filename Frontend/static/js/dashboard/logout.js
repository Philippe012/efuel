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

        if (!userAvatar.src.includes('ui-avatars.com')) {
            userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name)}&background=4361ee&color=fff`;
        }
        
        userName.textContent = session.user.name;

        // Load profile data into modal when opened
        document.querySelector('.dropdown-content a[href="#"]').addEventListener('click', function(e) {
            e.preventDefault();
            loadProfileData();
            document.getElementById('profileModal').style.display = 'block';
        });
    }

    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });

    // Close modal when clicking X
    document.querySelector('#profileModal .close-modal').addEventListener('click', function() {
        document.getElementById('profileModal').style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('profileModal')) {
            document.getElementById('profileModal').style.display = 'none';
        }
    });

    
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

function loadProfileData() {
    const user = JSON.parse(localStorage.getItem('efuel_user'));
    
    document.getElementById('fullName').value = user.fullName || '';
    document.getElementById('username').value = user.username || '';
    document.getElementById('gender').value = user.gender || 'PREFER_NOT_TO_SAY';
}

function updateProfile() {
    const user = JSON.parse(localStorage.getItem('efuel_user'));
    const token = localStorage.getItem('efuel_token');
    
    const profileData = {
        id: user.id,
        fullName: document.getElementById('fullName').value,
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('Password').value,
    };

    // Validate passwords if changing
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
        alert("New passwords don't match!");
        return;
    }

    // Remove confirmPassword before sending
    delete profileData.confirmPassword;

    // If not changing password, remove password fields
    if (!profileData.newPassword) {
        delete profileData.currentPassword;
        delete profileData.newPassword;
    }

    fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(updatedUser => {
        // Update local storage with new user data
        localStorage.setItem('efuel_user', JSON.stringify(updatedUser));
        
        // Update UI
        document.querySelector('.user-name').textContent = updatedUser.fullName || updatedUser.username;
        
        // Close modal and show success
        document.getElementById('profileModal').style.display = 'none';
        alert('Profile updated successfully!');
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        alert(error.message || 'Failed to update profile');
    });
}

function logoutUser() {
    const token = localStorage.getItem('efuel_token');
    
    // Call backend logout if needed
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).finally(() => {
        // Clear client-side session regardless of backend success
        localStorage.removeItem('efuel_user');
        localStorage.removeItem('efuel_token');
        
        // Redirect to login page with no history back
        window.location.replace('signin.html');
    });
}