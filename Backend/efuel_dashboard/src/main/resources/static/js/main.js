document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const addStationBtn = document.getElementById('add-station-btn');
    const stationModal = document.getElementById('station-modal');
    const closeModal = document.querySelector('.close-modal');
    const stationForm = document.getElementById('station-form');
    
    // Initialize Charts
    initCharts();
    
    // Theme Toggle Functionality
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');
        
        const icon = this.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        
        // Save preference to localStorage
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
    }
    
    // Sidebar Navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active link
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Get target section ID
            const targetId = this.getAttribute('href').substring(1);
            
            // Update page title
            pageTitle.textContent = this.textContent.trim();
            
            // Show the corresponding section
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            document.getElementById(`${targetId}-content`).style.display = 'block';
        });
    });
    
    // Station Management Modal
    addStationBtn.addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Add New Fuel Station';
        stationForm.reset();
        stationModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', function() {
        stationModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === stationModal) {
            stationModal.style.display = 'none';
        }
    });
    
    // Form Submission
    stationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send data to your backend
        // For demo purposes, we'll just close the modal
        stationModal.style.display = 'none';
        
        // Show success message
        alert('Station saved successfully!');
    });
    
    // Initialize DataTables (you would replace this with real data fetching)
    initDataTables();
    
    // Notification Bell
    const notificationBell = document.querySelector('.notification-bell');
    notificationBell.addEventListener('click', function() {
        alert('You have 3 new notifications');
        this.querySelector('.notification-count').style.display = 'none';
    });
});

function initCharts() {
    // Price Trend Chart
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    const priceChart = new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Petrol (RWF)',
                    data: [1350, 1380, 1400, 1420, 1430, 1450],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Diesel (RWF)',
                    data: [1250, 1280, 1300, 1320, 1350, 1380],
                    borderColor: '#4cc9f0',
                    backgroundColor: 'rgba(76, 201, 240, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    // Availability Chart
    const availabilityCtx = document.getElementById('availabilityChart').getContext('2d');
    const availabilityChart = new Chart(availabilityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Available', 'Unavailable', 'Maintenance'],
            datasets: [{
                data: [198, 42, 7],
                backgroundColor: [
                    '#4cc9f0',
                    '#f8961e',
                    '#f72585'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function initDataTables() {
    // In a real app, you would fetch data from your API here
    console.log('Initializing data tables...');
    
    // Example of adding event listeners to edit/delete buttons
    const editButtons = document.querySelectorAll('.btn-icon.edit');
    const deleteButtons = document.querySelectorAll('.btn-icon.delete');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[0].textContent;
            const name = row.cells[1].textContent;
            const location = row.cells[2].textContent;
            const status = row.cells[3].querySelector('.status-badge').textContent.trim();
            const petrolPrice = row.cells[4].textContent.replace(',', '');
            const dieselPrice = row.cells[5].textContent.replace(',', '');
            
            // Populate the modal with existing data
            document.getElementById('modal-title').textContent = 'Edit Fuel Station';
            document.getElementById('station-name').value = name;
            document.getElementById('station-location').value = location;
            document.getElementById('petrol-price').value = petrolPrice;
            document.getElementById('diesel-price').value = dieselPrice;
            document.getElementById('station-status').value = status.toLowerCase();
            
            stationModal.style.display = 'flex';
        });
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this station?')) {
                // In a real app, you would send a DELETE request to your API
                const row = this.closest('tr');
                row.remove();
                alert('Station deleted successfully!');
            }
        });
    });
}

// You would add more functions for other sections (users, prices, etc.)