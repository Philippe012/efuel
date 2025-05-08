// Main Map Controller
class MapController {
    constructor() {
        this.map = null;
        this.userMarker = null;
        this.userCircle = null;
        this.watchId = null;
        this.routingControl = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize with slight delay to ensure proper container sizing
            setTimeout(() => this.setupMap(), 100);
            this.setupEventListeners();
        });
    }

    setupMap() {
        // Kigali coordinates and bounds
        const kigaliCoords = [-1.9706, 30.1044];
        const kigaliBounds = L.latLngBounds(
            L.latLng(-2.1, 29.9),
            L.latLng(-1.8, 30.3)
        );

        // Create map instance
        this.map = L.map('map', {
            center: kigaliCoords,
            zoom: 13,
            maxBounds: kigaliBounds,
            zoomControl: false,
            attributionControl: false
        });

        // Store reference globally
        window.appMap = this.map;

        // Add base tile layer
        this.addTileLayer();
        
        // Initialize routing
        this.setupRouting();
        
        // Add station markers
        this.addStations();
        
        // Initial locate attempt
        this.locateUser();
    }

    addTileLayer() {
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            noWrap: true
        }).addTo(this.map);

        // Fallback layer
        osmLayer.on('tileerror', () => {
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);
        });
    }

    setupRouting() {
        this.routingControl = L.Routing.control({
            waypoints: [],
            routeWhileDragging: false,
            showAlternatives: false,
            fitSelectedRoutes: true,
            collapsible: true,
            addWaypoints: false,
            language: 'en',
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            formatter: new L.Routing.Formatter({
                language: 'en',
                units: 'metric'
            })
        }).addTo(this.map);
    }

    addStations() {
        // Custom icons
        const stationIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
        });

        // Sample stations data
        const stations = [
            { coords: [-1.9535, 30.0936], name: "eFuel Kigali Heights", price: "1.22€", address: "KN 5 Rd, Kigali" },
            { coords: [-1.9637, 30.0641], name: "eFuel Kacyiru", price: "1.25€", address: "KG 7 Ave, Kacyiru" },
            { coords: [-1.9972, 30.1129], name: "eFuel Nyabugogo", price: "1.20€", address: "KK 10 Ave, Nyabugogo" },
            { coords: [-1.9486, 30.1388], name: "eFuel Remera", price: "1.28€", address: "KG 11 Ave, Remera" },
        ];

        // Add markers
        stations.forEach(station => {
            const marker = L.marker(station.coords, { 
                icon: stationIcon,
                stationId: station.name.replace(/\s+/g, '-').toLowerCase()
            }).addTo(this.map);
            
            this.setupStationPopup(marker, station);
        });
    }

    setupStationPopup(marker, station) {
        const popupContent = L.DomUtil.create('div', 'station-popup');
        popupContent.innerHTML = `
            <h4>${station.name}</h4>
            <p><i class="fas fa-bolt"></i> Price: ${station.price}/kWh</p>
            <p><i class="fas fa-map-marker-alt"></i> ${station.address}</p>
            <button class="route-btn">
                <i class="fas fa-route"></i> Get Directions
            </button>
            <button class="route-btn secondary" style="margin-top: 5px;">
                <i class="fas fa-gas-pump"></i> Reserve Charger
            </button>
        `;

        marker.bindPopup(popupContent);
        
        marker.on('popupopen', () => {
            popupContent.querySelector('.route-btn').addEventListener('click', () => {
                this.calculateRouteToStation(marker.getLatLng());
                this.map.closePopup();
            });
        });
    }

    setupEventListeners() {
        document.getElementById('locateMe')?.addEventListener('click', () => this.locateUser());
        
        document.getElementById('zoomIn')?.addEventListener('click', () => this.map.zoomIn());
        document.getElementById('zoomOut')?.addEventListener('click', () => this.map.zoomOut());
        
        // Fullscreen controls
        this.setupFullscreenControls();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.map) {
                setTimeout(() => this.map.invalidateSize(), 100);
            }
        });
    }

    setupFullscreenControls() {
        const fullscreenToggle = document.getElementById('fullscreenToggle');
        const exitFullscreen = document.getElementById('exitFullscreen');
        const fullscreenIcon = document.getElementById('fullscreenIcon');
    
        // Toggle fullscreen
        fullscreenToggle?.addEventListener('click', () => this.toggleFullscreen());
        
        // Exit fullscreen with close button
        exitFullscreen?.addEventListener('click', () => this.toggleFullscreen());
    }

    toggleFullscreen() {
        const mapContainer = document.querySelector('.map-container');
        const fullscreenIcon = document.getElementById('fullscreenIcon');
        
        mapContainer.classList.toggle('fullscreen');
        
        if (mapContainer.classList.contains('fullscreen')) {
            fullscreenIcon.classList.replace('fa-expand', 'fa-compress');
            document.body.style.overflow = 'hidden';
        } else {
            fullscreenIcon.classList.replace('fa-compress', 'fa-expand');
            document.body.style.overflow = '';
        }
        
        // Trigger map resize after transition
        setTimeout(() => {
            this.map.invalidateSize();
            if (mapContainer.classList.contains('fullscreen')) {
                if (this.userMarker) {
                    this.map.setView(this.userMarker.getLatLng(), this.map.getZoom());
                }
            }
        }, 300);
    }

    locateUser() {
        if (!navigator.geolocation) {
            this.showToast("Geolocation not supported", "error");
            return;
        }
        
        this.showToast("Locating...", "info");
        
        navigator.geolocation.getCurrentPosition(
            (pos) => this.handleLocationFound(pos),
            (err) => this.handleLocationError(err),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    handleLocationFound(position) {
        const userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
        const radius = position.coords.accuracy / 2;
        
        if (!this.userMarker) {
            this.createUserMarker(userLatLng, radius);
        } else {
            this.updateUserPosition(userLatLng, radius);
        }
        
        this.startWatchingPosition();
        this.centerMapOnUser(userLatLng);
        this.showToast("Location found", "success");
    }

    createUserMarker(latlng, radius) {
        this.userMarker = L.marker(latlng, {
            icon: L.divIcon({
                className: 'user-location-icon',
                html: '<i class="fas fa-car"></i>',
                iconSize: [30, 30]
            }),
            zIndexOffset: 1000
        }).addTo(this.map);
        
        this.userCircle = L.circle(latlng, radius, {
            color: '#4361ee',
            fillColor: '#4361ee',
            fillOpacity: 0.2,
            weight: 1,
            zIndexOffset: 900
        }).addTo(this.map);
    }

    updateUserPosition(latlng, radius) {
        this.userMarker.setLatLng(latlng);
        this.userCircle.setLatLng(latlng).setRadius(radius);
    }

    startWatchingPosition() {
        if (this.watchId) return;
        
        this.watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const newLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
                this.updateUserPosition(newLatLng, pos.coords.accuracy / 2);
                
                // Follow in fullscreen mode
                if (document.querySelector('.map-container.fullscreen')) {
                    this.map.setView(newLatLng);
                }
            },
            (err) => console.error('Geolocation error:', err),
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
    }

    centerMapOnUser(latlng) {
        this.map.setView(latlng, 15);
    }

    handleLocationError(error) {
        const messages = {
            [error.PERMISSION_DENIED]: "Location access denied. Using default view.",
            [error.POSITION_UNAVAILABLE]: "Location unavailable.",
            [error.TIMEOUT]: "Location request timed out.",
            [error.UNKNOWN_ERROR]: "Unknown error occurred."
        };
        
        this.showToast(messages[error.code] || "Location error", "warning");
        this.map.setView([-1.9706, 30.1044], 13);
    }

    calculateRouteToStation(stationLatLng) {
        if (!this.routingControl) {
            this.showToast("Routing service unavailable", "error");
            return;
        }
        
        this.showToast("Calculating route...", "info");
        
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
                this.routingControl.setWaypoints([userLatLng, stationLatLng]);
                this.map.fitBounds(L.latLngBounds(userLatLng, stationLatLng), {
                    padding: [50, 50],
                    maxZoom: 14
                });
                this.showToast("Route calculated", "success");
            },
            (err) => {
                console.error("Location error:", err);
                this.showToast("Couldn't get location for routing", "error");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `map-toast ${type} show`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Initialize the map controller
new MapController();