document.addEventListener('DOMContentLoaded', function() {    
    updateDashboardStats();
    setInterval(updateDashboardStats, 300000);
    
    document.getElementById('fuel-type-select').addEventListener('change', function() {
        updateFuelPriceDisplay(this.value);
    });
});

// Fetch data from API and update dashboard
async function updateDashboardStats() {
    try {
        // In a real app, you would fetch this from your API
        // const response = await fetch('/api/dashboard-stats');
        // const data = await response.json();
        
        // Mock data - replace with actual API call
        const data = {
            nearbyStations: 42,
            fuelPrices: {
                electric: 1.24,
                petrol: 1.45,
                diesel: 1.38,
                gas: 0.98
            },
            availability: {
                percentage: 87,
                available: 36,
                total: 42
            },
            carbonSavings: "124kg"
        };
        
        // Update stations count
        document.getElementById('stations-count').textContent = data.nearbyStations;
        
        // Update fuel prices
        window.currentFuelPrices = data.fuelPrices;
        updateFuelPriceDisplay('electric'); // Default to electric
        
        // Update availability
        document.getElementById('availability-percent').textContent = `${data.availability.percentage}%`;
        document.getElementById('availability-detail').textContent = 
            `${data.availability.available} of ${data.availability.total} stations available`;
        
        // Update carbon savings
        document.getElementById('carbon-savings').textContent = data.carbonSavings;
        
    } catch (error) {
        console.error('Failed to update dashboard stats:', error);
        showToast('Failed to update statistics. Showing cached data.', 'error');
    }
}

// Update fuel price display based on selected type
function updateFuelPriceDisplay(fuelType) {
    const prices = window.currentFuelPrices || {
        electric: 1.24,
        petrol: 1.45,
        diesel: 1.38,
        gas: 0.98
    };
    
    const priceMap = {
        electric: { price: prices.electric, label: "Avg. Electric Price" },
        petrol: { price: prices.petrol, label: "Avg. Petrol Price" },
        diesel: { price: prices.diesel, label: "Avg. Diesel Price" },
        gas: { price: prices.gas, label: "Avg. Gas Price" }
    };
    
    const selected = priceMap[fuelType] || priceMap.electric;
    document.getElementById('current-price').textContent = `${selected.price.toFixed(2)}€`;
    document.getElementById('price-label').textContent = selected.label;
}

// Helper function to show toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}