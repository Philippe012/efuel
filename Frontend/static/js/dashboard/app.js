// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    
    // Any other app-wide functionality can go here
});

function setupMobileMenu() {
    // This would be used to toggle sidebar on mobile devices
    // You would need to add a menu toggle button in your HTML for this to work
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle icon-button';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    
    if (window.innerWidth < 992) {
        const header = document.querySelector('.header-container');
        if (header) {
            header.insertBefore(menuToggle, header.firstChild);
        }
    }
}

// You can add more application-wide functions here