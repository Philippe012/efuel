// Stations management
document.addEventListener('DOMContentLoaded', function() {
    // Load stations when stations view is shown
    document.getElementById('stations-view').addEventListener('viewShown', loadStations);
});

function loadStations() {
    const stationsView = document.getElementById('stations-view');
    
    // Sample stations content with CRUD functionality
    stationsView.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">Fuel Stations Management</h5>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#stationModal">
                    <i class="fas fa-plus"></i> Add Station
                </button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Prices (RWF)</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="stationsTable">
                            <!-- Stations will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Load stations data
    fetch('/api/stations')
        .then(response => response.json())
        .then(stations => {
            const tableBody = document.getElementById('stationsTable');
            tableBody.innerHTML = stations.map(station => `
                <tr>
                    <td>${station.name}</td>
                    <td>${station.latitude}, ${station.longitude}</td>
                    <td>
                        <strong>Electric:</strong> ${station.electricPrice}<br>
                        <strong>Petrol:</strong> ${station.petrolPrice}<br>
                        <strong>Diesel:</strong> ${station.dieselPrice}<br>
                        <strong>Gas:</strong> ${station.gasPrice}
                    </td>
                    <td>
                        <span class="badge ${station.active ? 'bg-success' : 'bg-secondary'}">
                            ${station.active ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-station" data-id="${station.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-station" data-id="${station.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
            
            // Add event listeners for edit/delete buttons
            document.querySelectorAll('.edit-station').forEach(btn => {
                btn.addEventListener('click', function() {
                    editStation(this.dataset.id);
                });
            });
            
            document.querySelectorAll('.delete-station').forEach(btn => {
                btn.addEventListener('click', function() {
                    deleteStation(this.dataset.id);
                });
            });
        })
        .catch(error => {
            console.error('Error loading stations:', error);
        });
}

function editStation(stationId) {
    // Fetch station data and populate modal
    fetch(`/api/stations/${stationId}`)
        .then(response => response.json())
        .then(station => {
            const modal = document.getElementById('stationModal');
            modal.querySelector('.modal-title').textContent = `Edit Station: ${station.name}`;
            
            // Populate form fields
            // This would be your actual form fields
            // modal.querySelector('#stationName').value = station.name;
            // etc...
            
            // Show modal
            new bootstrap.Modal(modal).show();
        });
}

function deleteStation(stationId) {
    if (confirm('Are you sure you want to delete this station?')) {
        fetch(`/api/stations/${stationId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadStations(); // Refresh the list
            }
        });
    }
}