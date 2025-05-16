// Load stations data
function loadStations() {
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
        .catch(error => console.error('Error loading stations:', error));
}

// Create or update a station
function saveStation(station) {
    const method = station.id ? 'PUT' : 'POST';
    const url = station.id ? `/api/stations/${station.id}` : '/api/stations';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(station)
    })
    .then(response => {
        if (response.ok) {
            loadStations(); // Refresh the list
            alert('Station saved successfully!');
        } else {
            alert('Error saving station.');
        }
    });
}

// Edit a station
function editStation(stationId) {
    fetch(`/api/stations/${stationId}`)
        .then(response => response.json())
        .then(station => {
            const modal = document.getElementById('stationModal');
            modal.querySelector('.modal-title').textContent = `Edit Station: ${station.name}`;
            modal.querySelector('#stationName').value = station.name;
            modal.querySelector('#stationLatitude').value = station.latitude;
            modal.querySelector('#stationLongitude').value = station.longitude;
            modal.querySelector('#stationElectricPrice').value = station.electricPrice;
            modal.querySelector('#stationPetrolPrice').value = station.petrolPrice;
            modal.querySelector('#stationDieselPrice').value = station.dieselPrice;
            modal.querySelector('#stationGasPrice').value = station.gasPrice;
            modal.querySelector('#stationActive').checked = station.active;

            // Save changes
            modal.querySelector('#saveStationBtn').onclick = function() {
                const updatedStation = {
                    id: station.id,
                    name: modal.querySelector('#stationName').value,
                    latitude: modal.querySelector('#stationLatitude').value,
                    longitude: modal.querySelector('#stationLongitude').value,
                    electricPrice: modal.querySelector('#stationElectricPrice').value,
                    petrolPrice: modal.querySelector('#stationPetrolPrice').value,
                    dieselPrice: modal.querySelector('#stationDieselPrice').value,
                    gasPrice: modal.querySelector('#stationGasPrice').value,
                    active: modal.querySelector('#stationActive').checked
                };
                saveStation(updatedStation);
            };

            new bootstrap.Modal(modal).show();
        });
}

// Delete a station
function deleteStation(stationId) {
    if (confirm('Are you sure you want to delete this station?')) {
        fetch(`/api/stations/${stationId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    loadStations(); // Refresh the list
                    alert('Station deleted successfully!');
                } else {
                    alert('Error deleting station.');
                }
            });
    }
}

// Add a new station
document.getElementById('addStationBtn').addEventListener('click', function() {
    const modal = document.getElementById('stationModal');
    modal.querySelector('.modal-title').textContent = 'Add New Station';
    modal.querySelector('#stationName').value = '';
    modal.querySelector('#stationLatitude').value = '';
    modal.querySelector('#stationLongitude').value = '';
    modal.querySelector('#stationElectricPrice').value = '';
    modal.querySelector('#stationPetrolPrice').value = '';
    modal.querySelector('#stationDieselPrice').value = '';
    modal.querySelector('#stationGasPrice').value = '';
    modal.querySelector('#stationActive').checked = false;

    modal.querySelector('#saveStationBtn').onclick = function() {
        const newStation = {
            name: modal.querySelector('#stationName').value,
            latitude: modal.querySelector('#stationLatitude').value,
            longitude: modal.querySelector('#stationLongitude').value,
            electricPrice: modal.querySelector('#stationElectricPrice').value,
            petrolPrice: modal.querySelector('#stationPetrolPrice').value,
            dieselPrice: modal.querySelector('#stationDieselPrice').value,
            gasPrice: modal.querySelector('#stationGasPrice').value,
            active: modal.querySelector('#stationActive').checked
        };
        saveStation(newStation);
    };

    new bootstrap.Modal(modal).show();
});