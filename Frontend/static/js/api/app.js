import { fetchStations } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const stationsList = document.getElementById('stations-list');
    const refreshBtn = document.getElementById('refresh-btn');

    async function loadStations() {
        stationsList.innerHTML = 'Loading...';
        try {
            const stations = await fetchStations();
            stationsList.innerHTML = stations.map(station => `
                <div class="station">
                    <h3>${station.name}</h3>
                    <p>Location: ${station.lat}, ${station.lng}</p>
                </div>
            `).join('');
        } catch (error) {
            stationsList.innerHTML = `Error: ${error.message}`;
        }
    }

    refreshBtn.addEventListener('click', loadStations);
    loadStations(); // Initial load
});