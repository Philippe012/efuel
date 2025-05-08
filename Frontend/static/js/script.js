// Main application script
let map;
let userMarker;
let stationMarkers = [];
let routeControl;
let userLocation;
let currentTheme = 'light';
let isAuthenticated = false;

// Rwanda fuel prices (RWF)
const rwandaPrices = {
  petrol: 1350,
  diesel: 1250,
  gas: 1000,
  electric: 500
};

// Initialize the application
function initApp() {
  checkAuthStatus();
  initMap();
  setupEventListeners();
}

// Check authentication status
function checkAuthStatus() {
  // In a real app, you would check cookies/localStorage/tokens
  const authToken = localStorage.getItem('fuelLocatorAuthToken');
  isAuthenticated = !!authToken;
  updateAuthUI();
}

// Update UI based on auth status
function updateAuthUI() {
  const authButton = document.getElementById('authButton');
  if (isAuthenticated) {
    authButton.innerHTML = '<i class="fas fa-user"></i> Account';
  } else {
    authButton.innerHTML = '<i class="fas fa-user"></i> Sign In';
  }
}

// Initialize the map
function initMap() {
  // Start with a view centered on Rwanda
  map = L.map('map').setView([-1.9403, 29.8739], 12);

  // Add tile layer
  updateMapTheme();

  // Add geocoder control
  L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: 'Search for a location...',
    errorMessage: 'Nothing found.'
  })
  .on('markgeocode', function(e) {
    const center = e.geocode.center;
    map.setView(center, 14);
    
    // If user is not located yet, use this as their location
    if (!userLocation) {
      userLocation = [center.lat, center.lng];
      addUserMarker(userLocation);
    }
  })
  .addTo(map);

  // Try to get user's location
  locateUser();
}

// Update map theme based on current theme
function updateMapTheme() {
  if (map) {
    map.eachLayer(layer => {
      if (layer._url && layer._url.includes('{s}.tile')) {
        map.removeLayer(layer);
      }
    });

    if (currentTheme === 'dark') {
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
  }
}

// Locate the user
function locateUser() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = [position.coords.latitude, position.coords.longitude];
        map.setView(userLocation, 14);
        addUserMarker(userLocation);
      }, 
      (error) => {
        console.error("Geolocation error:", error);
        showToast("Location access denied. Using Rwanda center.", 'warning');
        userLocation = [-1.9403, 29.8739];
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  } else {
    showToast("Geolocation not supported. Using Rwanda center.", 'warning');
    userLocation = [-1.9403, 29.8739];
  }
}

// Add user marker to map
function addUserMarker(location) {
  if (userMarker) {
    map.removeLayer(userMarker);
  }
  
  userMarker = L.marker(location, { 
    icon: userIcon(),
    zIndexOffset: 1000
  }).addTo(map)
    .bindPopup('<b>Your Location</b>').openPopup();
}

// Custom icons
function userIcon() {
  return L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

function stationIcon(fuelType = 'fuel') {
  let iconUrl;
  const size = [35, 35];
  const anchor = [17, 35];
  
  switch(fuelType) {
    case 'electric':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png';
      break;
    case 'gas':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/3659/3659899.png';
      break;
    case 'petrol':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1063/1063376.png';
      break;
    case 'diesel':
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1063/1063376.png';
      break;
    default:
      iconUrl = 'https://cdn-icons-png.flaticon.com/512/1063/1063376.png';
  }
  
  return L.icon({
    iconUrl: iconUrl,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -35],
  });
}

// Setup event listeners
function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Find stations button
  document.getElementById('findStations').addEventListener('click', findStations);
  
  // View prices button
  document.getElementById('viewPrices').addEventListener('click', showPrices);
  
  // Locate me button
  document.getElementById('locateMe').addEventListener('click', locateUser);
  
  // Close sidebar button
  document.getElementById('closeSidebar').addEventListener('click', closeSidebar);
  
  // Auth button
  document.getElementById('authButton').addEventListener('click', () => {
    window.location.href = 'auth.html';
  });
}

// Toggle between light and dark theme
function toggleTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (currentTheme === 'light') {
    currentTheme = 'dark';
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    currentTheme = 'light';
    document.body.classList.remove('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
  updateMapTheme();
  
  // Save preference to localStorage
  localStorage.setItem('fuelLocatorTheme', currentTheme);
}

// Find nearby stations
function findStations() {
  if (!userLocation) {
    showToast("Please wait while we determine your location...", 'warning');
    locateUser();
    return;
  }

  clearMarkers();

  const fuelType = document.getElementById('fuelType').value;
  const radius = document.getElementById('radius').value;

  // In a real app, you would query your backend API here
  // For demo, we'll use mock data with some stations around Rwanda
  const mockStations = generateMockStations(userLocation, parseInt(radius), fuelType);

  if (mockStations.length === 0) {
    showToast(`No ${fuelType === 'all' ? '' : fuelType + ' '}stations found nearby!`, 'warning');
    return;
  }

  let nearestStation = null;
  let minDistance = Infinity;

  mockStations.forEach(station => {
    const stationLoc = [station.lat, station.lon];
    const dist = getDistance(userLocation, stationLoc);

    const marker = L.marker(stationLoc, { 
      icon: stationIcon(station.type),
      stationData: station  // Store station data with marker
    }).addTo(map)
      .bindPopup(`
        <b>${station.name}</b><br>
        <small>${getStationTypeLabel(station.type)}</small><br>
        📏 ${dist.toFixed(2)} km away<br>
        <button onclick="showStationDetails('${station.id}')" 
          class="popup-button">
          Details
        </button>
      `);

    marker.on('click', () => {
      getRoute(stationLoc);
    });

    stationMarkers.push(marker);

    if (dist < minDistance) {
      minDistance = dist;
      nearestStation = station;
    }
  });

  if (nearestStation) {
    getRoute([nearestStation.lat, nearestStation.lon]);
    // Auto-open the nearest station popup
    setTimeout(() => {
      const nearestMarker = stationMarkers.find(m => 
        m.options.stationData.id === nearestStation.id
      );
      if (nearestMarker) {
        nearestMarker.openPopup();
      }
    }, 1000);
  }
}

// Get station type label
function getStationTypeLabel(type) {
  switch(type) {
    case 'electric': return '⚡ Charging Station';
    case 'petrol': return '⛽ Petrol Station';
    case 'diesel': return '⛽ Diesel Station';
    case 'gas': return '⛽ Gas Station';
    default: return '⛽ Fuel Station';
  }
}

// Generate mock station data for demonstration
function generateMockStations(center, radius, fuelType) {
  const stationTypes = fuelType === 'all' ? ['petrol', 'diesel', 'gas', 'electric'] : [fuelType];
  const stations = [];
  
  // Generate 5-15 random stations
  const count = Math.floor(Math.random() * 10) + 5;
  
  for (let i = 0; i < count; i++) {
    const type = stationTypes[Math.floor(Math.random() * stationTypes.length)];
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * radius / 1000; // Convert to km
    
    // Calculate coordinates
    const lat = center[0] + (distance / 111.32) * Math.cos(angle);
    const lon = center[1] + (distance / (111.32 * Math.cos(center[0] * Math.PI / 180))) * Math.sin(angle);
    
    stations.push({
      id: `station-${i}-${Date.now()}`,
      name: getRandomStationName(type, i+1),
      type: type,
      lat: lat,
      lon: lon,
      prices: {
        petrol: Math.round(rwandaPrices.petrol * (0.9 + Math.random() * 0.2)),
        diesel: Math.round(rwandaPrices.diesel * (0.9 + Math.random() * 0.2)),
        gas: Math.round(rwandaPrices.gas * (0.9 + Math.random() * 0.2)),
        electric: Math.round(rwandaPrices.electric * (0.9 + Math.random() * 0.2))
      },
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      address: getRandomAddress(),
      phone: getRandomPhoneNumber(),
      amenities: getRandomAmenities(type)
    });
  }
  
  return stations;
}

// Helper functions for mock data
function getRandomStationName(type, index) {
  const prefixes = {
    petrol: ['Petrol', 'Fuel', 'Energy', 'Power'],
    diesel: ['Diesel', 'Fuel', 'Truck', 'Heavy'],
    gas: ['Gas', 'LPG', 'Propane', 'Fuel'],
    electric: ['EV', 'Charge', 'Electro', 'Power']
  };
  
  const suffixes = ['Center', 'Station', 'Point', 'Depot', 'Hub', 'Stop'];
  const brands = ['Shell', 'Total', 'BP', 'Mobil', 'KOGA', 'Rubis'];
  
  const prefixList = prefixes[type] || ['Fuel'];
  const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const useBrand = Math.random() > 0.5;
  
  if (useBrand) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    return `${brand} ${prefix} ${index}`;
  }
  
  return `${prefix} ${suffix} ${index}`;
}

function getRandomAddress() {
  const streets = ['KN', 'KG', 'KK', 'RN', 'RG'];
  const streetNum = Math.floor(Math.random() * 200) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  return `${street} ${streetNum} St, Kigali`;
}

function getRandomPhoneNumber() {
  return `+250 78${Math.floor(1000000 + Math.random() * 9000000)}`;
}

function getRandomAmenities(type) {
  const common = ['Toilet', 'Shop', 'ATM', 'Air Pump'];
  const fuelSpecific = ['Car Wash', 'Mechanic', 'Tyre Service'];
  const electricSpecific = ['Cafe', 'WiFi', 'Rest Area'];
  
  let amenities = [...common];
  
  if (type === 'electric') {
    amenities = amenities.concat(electricSpecific);
  } else {
    amenities = amenities.concat(fuelSpecific);
  }
  
  // Randomly select 2-4 amenities
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = amenities.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Show station details in sidebar
function showStationDetails(stationId) {
  const marker = stationMarkers.find(m => m.options.stationData.id === stationId);
  if (!marker) return;
  
  const station = marker.options.stationData;
  const sidebar = document.getElementById('sidebar');
  const sidebarContent = document.getElementById('sidebarContent');
  
  document.getElementById('sidebarTitle').textContent = station.name;
  
  // Format last updated date
  const updatedDate = station.lastUpdated.toLocaleDateString('en-RW', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
  // Create sidebar content
  sidebarContent.innerHTML = `
    <div class="station-info">
      <h4>${getStationTypeLabel(station.type)}</h4>
      <p>${station.address}</p>
      <p>Phone: ${station.phone}</p>
      <p class="price-update">Last updated: ${updatedDate}</p>
      
      <div class="price-list">
        <h4>Current Prices (RWF):</h4>
        ${station.type !== 'electric' ? `
          <div class="price-item">
            <span class="fuel-type">Petrol (1L):</span>
            <span class="fuel-price">${station.prices.petrol}</span>
          </div>
          <div class="price-item">
            <span class="fuel-type">Diesel (1L):</span>
            <span class="fuel-price">${station.prices.diesel}</span>
          </div>
          <div class="price-item">
            <span class="fuel-type">Gas (1L):</span>
            <span class="fuel-price">${station.prices.gas}</span>
          </div>
        ` : `
          <div class="price-item">
            <span class="fuel-type">Electric (1kWh):</span>
            <span class="fuel-price">${station.prices.electric}</span>
          </div>
        `}
      </div>
      
      <div class="amenities">
        <h4>Amenities:</h4>
        <div class="amenities-list">
          ${station.amenities.map(amenity => `
            <span class="amenity-badge">
              <i class="fas fa-${getAmenityIcon(amenity)}"></i> ${amenity}
            </span>
          `).join('')}
        </div>
      </div>
      
      <button onclick="getRoute([${station.lat}, ${station.lon}])" class="primary-button" style="width: 100%; margin-top: 1rem;">
        <i class="fas fa-route"></i> Get Directions
      </button>
    </div>
    
    <div class="stats-container">
      <div class="stat-card">
        <h4>Distance</h4>
        <div class="stat-value">${getDistance(userLocation, [station.lat, station.lon]).toFixed(2)} km</div>
      </div>
      <div class="stat-card">
        <h4>Estimated Time</h4>
        <div class="stat-value">${Math.ceil(getDistance(userLocation, [station.lat, station.lon]) * 3)} min</div>
      </div>
    </div>
  `;
  
  sidebar.classList.add('open');
}

// Get amenity icon

function getAmenityIcon(amenity) {
  const icons = {
    'Toilet': 'toilet',
    'Shop': 'store',
    'ATM': 'money-bill-wave',
    'Air Pump': 'wind',
    'Car Wash': 'car-wash',
    'Mechanic': 'tools',
    'Tyre Service': 'tire',
    'Cafe': 'coffee',
    'WiFi': 'wifi',
    'Rest Area': 'couch'
  };
  return icons[amenity] || 'check';
}

// Show Rwanda fuel prices
function showPrices() {
  const sidebar = document.getElementById('sidebar');
  const sidebarContent = document.getElementById('sidebarContent');
  
  document.getElementById('sidebarTitle').textContent = 'Rwanda Fuel Prices';
  
  sidebarContent.innerHTML = `
    <div class="station-info">
      <h4>Current Average Prices in Rwanda</h4>
      <p class="price-update">Last updated: ${new Date().toLocaleDateString('en-RW')}</p>
      
      <div class="price-list">
        <div class="price-item">
          <span class="fuel-type">Petrol (1L):</span>
          <span class="fuel-price">${rwandaPrices.petrol} RWF</span>
        </div>
        <div class="price-item">
          <span class="fuel-type">Diesel (1L):</span>
          <span class="fuel-price">${rwandaPrices.diesel} RWF</span>
        </div>
        <div class="price-item">
          <span class="fuel-type">Gas (1L):</span>
          <span class="fuel-price">${rwandaPrices.gas} RWF</span>
        </div>
        <div class="price-item">
          <span class="fuel-type">Electric (1kWh):</span>
          <span class="fuel-price">${rwandaPrices.electric} RWF</span>
        </div>
      </div>
      
      <div class="price-trends">
        <h4>Price Trends</h4>
        <p>Prices are updated regularly based on market rates.</p>
        <p>Electric charging costs vary by station and charging speed.</p>
      </div>
    </div>
  `;
  
  sidebar.classList.add('open');
}

// Close sidebar
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

// Clear all markers from map
function clearMarkers() {
  stationMarkers.forEach(marker => map.removeLayer(marker));
  stationMarkers = [];
  if (routeControl) {
    map.removeControl(routeControl);
    routeControl = null;
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast';
  toast.classList.add(type, 'show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Calculate distance between two coordinates in km
function getDistance(coord1, coord2) {
  const R = 6371; // km
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);
  const lat1 = toRad(coord1[0]);
  const lat2 = toRad(coord2[0]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initApp);




// Base API URL
const API_BASE_URL = 'http://localhost:8080/api';

// Updated findStations function
async function findStations() {
  if (!userLocation) {
    showToast("Please wait while we determine your location...", 'warning');
    locateUser();
    return;
  }

  clearMarkers();

  const fuelType = document.getElementById('fuelType').value;
  const radius = document.getElementById('radius').value;

  try {
    let url = `${API_BASE_URL}/stations/nearby?lat=${userLocation[0]}&lng=${userLocation[1]}&radius=${radius}`;
    if (fuelType !== 'all') {
      url += `&type=${fuelType}`;
    }

    const response = await fetch(url);
    const stations = await response.json();

    if (stations.length === 0) {
      showToast(`No ${fuelType === 'all' ? '' : fuelType + ' '}stations found nearby!`, 'warning');
      return;
    }

    let nearestStation = null;
    let minDistance = Infinity;

    stations.forEach(station => {
      const stationLoc = [station.latitude, station.longitude];
      const dist = getDistance(userLocation, stationLoc);

      const marker = L.marker(stationLoc, { 
        icon: stationIcon(station.type.toLowerCase()),
        stationData: station
      }).addTo(map)
        .bindPopup(`
          <b>${station.name}</b><br>
          <small>${getStationTypeLabel(station.type.toLowerCase())}</small><br>
          📏 ${dist.toFixed(2)} km away<br>
          <button onclick="showStationDetails('${station.id}')" 
            class="popup-button">
            Details
          </button>
        `);

      marker.on('click', () => {
        getRoute(stationLoc);
      });

      stationMarkers.push(marker);

      if (dist < minDistance) {
        minDistance = dist;
        nearestStation = station;
      }
    });

    if (nearestStation) {
      getRoute([nearestStation.latitude, nearestStation.longitude]);
      setTimeout(() => {
        const nearestMarker = stationMarkers.find(m => 
          m.options.stationData.id === nearestStation.id
        );
        if (nearestMarker) {
          nearestMarker.openPopup();
        }
      }, 1000);
    }
  } catch (err) {
    console.error("Error fetching stations:", err);
    showToast("Failed to load stations. Using mock data.", 'error');
    // Fallback to mock data
    const mockStations = generateMockStations(userLocation, parseInt(radius), fuelType);
    displayStations(mockStations, fuelType);
  }
}

// Updated getRoute function
async function getRoute(destination) {
  if (!userLocation) {
    showToast("Cannot calculate route without your location", 'warning');
    return;
  }

  if (routeControl) {
    map.removeControl(routeControl);
    routeControl = null;
  }

  try {
    // In a real app, you would use a routing service like OpenRouteService
    // For demo with our Java backend, we'll use the nearest endpoint
    const response = await fetch(`${API_BASE_URL}/stations/nearest?lat=${userLocation[0]}&lng=${userLocation[1]}`);
    const nearestStations = await response.json();
    
    if (nearestStations.length > 0) {
      const nearestStation = nearestStations[0];
      const destination = [nearestStation.latitude, nearestStation.longitude];
      
      // Use Leaflet Routing Machine as before
      routeControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destination[0], destination[1])
        ],
        // ... rest of the routing configuration
      }).addTo(map);
      
      routeControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        const distance = (summary.totalDistance / 1000).toFixed(1);
        const time = Math.ceil(summary.totalTime / 60);
        
        showToast(`Route found: ${distance} km, ~${time} min`, 'success');
      });
    }
  } catch (err) {
    console.error("Error calculating route:", err);
    showToast("Could not calculate route. Showing straight line.", 'error');
    showStraightLineRoute(destination);
  }
}

// Updated showStationDetails function
async function showStationDetails(stationId) {
  try {
    const response = await fetch(`${API_BASE_URL}/stations/${stationId}`);
    const station = await response.json();
    
    // Rest of the function remains the same, using the real station data
    // ...
  } catch (err) {
    console.error("Error fetching station details:", err);
    showToast("Failed to load station details", 'error');
  }
}