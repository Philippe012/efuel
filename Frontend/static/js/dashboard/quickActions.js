// Quick Actions Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close-btn');
    
    function openModal(content) {
        modalBody.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Scan and Pay Button
    document.getElementById('scanPayBtn').addEventListener('click', function() {
        openModal(`
            <i class="fas fa-qrcode" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
            <h3>Scan and Pay</h3>
            <p>This feature is coming soon!</p>
            <p>We're working hard to bring you a seamless payment experience.</p>
        `);
    });
    
    // Find Station Button
    document.getElementById('findStationBtn').addEventListener('click', function() {
        if (navigator.geolocation) {
            openModal(`
                <div class="location-loading">
                    <i class="fas fa-compass fa-spin" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                    <h3>Finding Nearest Station</h3>
                    <p>Getting your location...</p>
                </div>
            `);
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Success - simulate finding stations
                    setTimeout(() => {
                        modalBody.innerHTML = `
                            <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: var(--success-color); margin-bottom: 1rem;"></i>
                            <h3>Station Found</h3>
                            <p>We found 3 stations within 2km of your location.</p>
                            <button class="btn-primary" style="margin-top: 1rem; width: 100%;" onclick="closeModal()">
                                Show on Map
                            </button>
                        `;
                    }, 1500);
                },
                function(error) {
                    // Error
                    modalBody.innerHTML = `
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                        <h3>Location Error</h3>
                        <p>Could not access your location. Please enable location services.</p>
                        <button class="btn-primary" style="margin-top: 1rem; width: 100%;" onclick="closeModal()">
                            OK
                        </button>
                    `;
                }
            );
        } else {
            openModal(`
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                <h3>Browser Not Supported</h3>
                <p>Your browser doesn't support geolocation features.</p>
            `);
        }
    });
    
    // History Button
    document.getElementById('historyBtn').addEventListener('click', function() {
        openModal(`
            <i class="fas fa-history" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
            <h3>Transaction History</h3>
            <p>This feature is coming soon!</p>
            <p>You'll be able to view your past transactions here.</p>
        `);
    });
    
    // Favorites Button
    document.getElementById('favoritesBtn').addEventListener('click', function() {
        openModal(`
            <i class="fas fa-star" style="font-size: 3rem; color: var(--warning-color); margin-bottom: 1rem;"></i>
            <h3>Favorite Stations</h3>
            <div style="text-align: left; margin: 1rem 0;">
                <div style="display: flex; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                    <i class="fas fa-gas-pump" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
                    <span>Shell Kigali Downtown</span>
                </div>
                <div style="display: flex; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                    <i class="fas fa-charging-station" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
                    <span>TotalEnergies EV Station</span>
                </div>
                <div style="display: flex; align-items: center; padding: 0.5rem 0;">
                    <i class="fas fa-gas-pump" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
                    <span>KOGAZ Nyabugogo</span>
                </div>
            </div>
            <button class="btn-primary" style="width: 100%;" onclick="closeModal()">
                Close
            </button>
        `);
    });
    
    // Alerts Button
    document.getElementById('alertsBtn').addEventListener('click', function() {
        openModal(`
            <i class="fas fa-bell" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
            <h3>Alerts</h3>
            <p>This feature is coming soon!</p>
            <p>Set up notifications for price drops and special offers.</p>
        `);
    });
    
    // Share Button
    document.getElementById('shareBtn').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'eFuel Stations',
                text: 'Check out these great fuel stations near you!',
                url: 'https://efuel.example.com/stations'
            }).catch(err => {
                openModal(`
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                    <h3>Sharing Failed</h3>
                    <p>${err.message}</p>
                `);
            });
        } else {
            openModal(`
                <i class="fas fa-share-alt" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                <h3>Share Location</h3>
                <p>Share station locations via:</p>
                <div class="share-options">
                    <div class="share-option" onclick="shareVia('whatsapp')">
                        <i class="fab fa-whatsapp" style="color: #25D366;"></i>
                    </div>
                    <div class="share-option" onclick="shareVia('facebook')">
                        <i class="fab fa-facebook" style="color: #4267B2;"></i>
                    </div>
                    <div class="share-option" onclick="shareVia('twitter')">
                        <i class="fab fa-twitter" style="color: #1DA1F2;"></i>
                    </div>
                    <div class="share-option" onclick="shareVia('email')">
                        <i class="fas fa-envelope" style="color: var(--text-primary);"></i>
                    </div>
                </div>
                <button class="btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="closeModal()">
                    Cancel
                </button>
            `);
        }
    });
    
    // Share via specific platform (simulated)
    window.shareVia = function(platform) {
        let message = "Shared via " + platform;
        openModal(`
            <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success-color); margin-bottom: 1rem;"></i>
            <h3>Shared Successfully</h3>
            <p>${message}</p>
            <button class="btn-primary" style="width: 100%; margin-top: 1rem;" onclick="closeModal()">
                OK
            </button>
        `);
    };
});