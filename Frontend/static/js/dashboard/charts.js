// Price Chart Controller
class PriceChart {
    constructor() {
        this.chart = null;
        this.currentFuelType = 'electric';
        this.currentPeriod = 'week';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupChart();
            this.setupEventListeners();
            this.loadData();
        });
    }

    setupChart() {
        const ctx = document.getElementById('priceChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: this.getChartOptions()
        });
    }

    getChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += this.formatPrice(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted'),
                        callback: (value) => this.formatPrice(value)
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted')
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                    }
                }
            },
            animation: {
                duration: 1000
            }
        };
    }

    setupEventListeners() {
        // Fuel type selector
        document.getElementById('fuelTypeSelect')?.addEventListener('change', (e) => {
            this.currentFuelType = e.target.value;
            this.loadData();
        });

        // Time period buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPeriod = btn.dataset.period;
                this.loadData();
            });
        });

        // Refresh button
        document.getElementById('refreshChart')?.addEventListener('click', () => {
            this.loadData(true);
        });

        // Watch for theme changes to update chart colors
        const observer = new MutationObserver(() => {
            if (this.chart) {
                this.chart.options = this.getChartOptions();
                this.chart.update();
            }
        });
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['data-theme'] 
        });
    }

    async loadData(forceRefresh = false) {
        try {
            // Show loading state
            document.getElementById('lastUpdated').textContent = 'Loading...';
            
            // In a real app, you would fetch from your API:
            // const response = await fetch(`/api/fuel-prices?type=${this.currentFuelType}&period=${this.currentPeriod}&refresh=${forceRefresh}`);
            // const data = await response.json();
            
            // Mock data - replace with actual API call
            const data = this.generateMockData();
            
            this.updateChart(data);
            document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
        } catch (error) {
            console.error('Error loading chart data:', error);
            document.getElementById('lastUpdated').textContent = 'Error loading data';
        }
    }

    generateMockData() {
        // This generates sample data - replace with actual API data
        const periods = {
            week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            month: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
        
        const basePrices = {
            electric: 1.20,
            petrol: 1200,
            diesel: 1100,
            gas: 800
        };
        
        const labels = periods[this.currentPeriod];
        const basePrice = basePrices[this.currentFuelType];
        const variation = this.currentPeriod === 'week' ? 0.05 : 
                         this.currentPeriod === 'month' ? 0.15 : 0.3;
        
        const data = labels.map((_, i) => {
            const progress = i / (labels.length - 1);
            const fluctuation = Math.sin(progress * Math.PI * 2) * variation;
            return basePrice * (1 + fluctuation);
        });
        
        return {
            labels,
            datasets: [{
                label: this.getFuelLabel(this.currentFuelType),
                data,
                borderColor: this.getFuelColor(this.currentFuelType),
                backgroundColor: this.getFuelColor(this.currentFuelType, 0.1),
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };
    }

    updateChart(data) {
        this.chart.data.labels = data.labels;
        this.chart.data.datasets = data.datasets;
        this.chart.update();
    }

    getFuelLabel(type) {
        const labels = {
            electric: 'Electric (€/kWh)',
            petrol: 'Petrol (RWF/L)',
            diesel: 'Diesel (RWF/L)',
            gas: 'Gas (RWF/kg)'
        };
        return labels[type] || type;
    }

    getFuelColor(type, opacity = 1) {
        const colors = {
            electric: `rgba(67, 97, 238, ${opacity})`, // Blue
            petrol: `rgba(220, 53, 69, ${opacity})`,    // Red
            diesel: `rgba(253, 126, 20, ${opacity})`,   // Orange
            gas: `rgba(25, 135, 84, ${opacity})`        // Green
        };
        return colors[type] || `rgba(108, 117, 125, ${opacity})`;
    }

    formatPrice(value) {
        if (this.currentFuelType === 'electric') {
            return `${value.toFixed(2)}€`;
        }
        return `${Math.round(value)} RWF`;
    }
}

// Initialize the chart
new PriceChart();