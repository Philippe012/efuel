// Routing functionality using Leaflet Routing Machine
function getRoute(destination) {
    if (!userLocation) {
      showToast("Cannot calculate route without your location", 'warning');
      return;
    }
  
    // Remove existing route if any
    if (routeControl) {
      map.removeControl(routeControl);
      routeControl = null;
    }
  
    // Create new route
    routeControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: true,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [
          {
            color: currentTheme === 'dark' ? '#4cc9f0' : '#4361ee',
            opacity: 0.8,
            weight: 6
          }
        ]
      },
      createMarker: function(i, wp) {
        if (i === 0) {
          return L.marker(wp.latLng, {
            icon: userIcon(),
            zIndexOffset: 1000
          }).bindPopup('Your location');
        }
        return null; // Don't create marker for destination (we already have one)
      },
      formatter: new L.Routing.Formatter({
        language: 'en',
        units: 'metric'
      })
    }).addTo(map);
  
    // Show toast with estimated time
    routeControl.on('routesfound', function(e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      const distance = (summary.totalDistance / 1000).toFixed(1);
      const time = Math.ceil(summary.totalTime / 60);
      
      showToast(`Route found: ${distance} km, ~${time} min`, 'success');
    });
  
    routeControl.on('routingerror', function(e) {
      showToast("Could not calculate route. Showing straight line.", 'error');
      showStraightLineRoute(destination);
    });
  }
  
  // Fallback straight line route if routing fails
  function showStraightLineRoute(destination) {
    if (routeControl) {
      map.removeControl(routeControl);
      routeControl = null;
    }
  
    const line = L.polyline([userLocation, destination], {
      color: currentTheme === 'dark' ? '#4cc9f0' : '#4361ee',
      weight: 3,
      dashArray: '5, 5',
      opacity: 0.7
    }).addTo(map);
  
    // Calculate straight line distance
    const distance = getDistance(userLocation, destination).toFixed(1);
    const time = Math.ceil(distance * 3); // Estimate 3 min per km
    
    showToast(`Straight line: ${distance} km, ~${time} min`, 'warning');
    
    // Store reference to remove later
    routeControl = {
      _line: line,
      remove: function() {
        map.removeLayer(this._line);
      }
    };
  }