// Notifications management
document.addEventListener('DOMContentLoaded', function() {
    // Load notifications when notifications view is shown
    document.getElementById('notifications-view').addEventListener('viewShown', loadNotifications);
    
    // Load notification dropdown
    loadNotificationDropdown();
});

function loadNotifications() {
    const notificationsView = document.getElementById('notifications-view');
    
    notificationsView.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">Notifications Management</h5>
                <button class="btn btn-primary" id="sendNotificationBtn">
                    <i class="fas fa-paper-plane"></i> Send Notification
                </button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Message</th>
                                <th>Sent To</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="notificationsTable">
                            <!-- Notifications will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Load notifications data
    fetch('/api/notifications')
        .then(response => response.json())
        .then(notifications => {
            const tableBody = document.getElementById('notificationsTable');
            tableBody.innerHTML = notifications.map(notification => `
                <tr>
                    <td>${notification.title}</td>
                    <td>${notification.message.substring(0, 50)}...</td>
                    <td>${notification.recipients}</td>
                    <td>${new Date(notification.date).toLocaleString()}</td>
                    <td>
                        <span class="badge ${notification.read ? 'bg-success' : 'bg-warning'}">
                            ${notification.read ? 'Read' : 'Unread'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-info view-notification" data-id="${notification.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-notification" data-id="${notification.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        });
}

function loadNotificationDropdown() {
    // Load notifications for dropdown
    fetch('/api/notifications?limit=5')
        .then(response => response.json())
        .then(notifications => {
            const dropdown = document.querySelector('.notification-list');
            dropdown.innerHTML = notifications.map(notification => `
                <div class="notification-item ${notification.read ? '' : 'unread'}">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message.substring(0, 60)}...</div>
                    <div class="notification-time">${new Date(notification.date).toLocaleTimeString()}</div>
                </div>
            `).join('');
            
            // Update badge count
            const unreadCount = notifications.filter(n => !n.read).length;
            document.querySelector('.notification-btn .badge').textContent = unreadCount;
        });
}