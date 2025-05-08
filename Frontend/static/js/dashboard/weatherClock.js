// Enhanced JavaScript with Weather Icons and Dynamic Updates
document.addEventListener('DOMContentLoaded', function() {
  // Clock Functionality
  function updateClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
      });
      document.getElementById('clock').textContent = timeStr;
      
      const dateStr = now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
      });
      document.getElementById('compact-date').textContent = dateStr;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Weather Data with Icons Mapping
  const weatherConditions = {
      'clear': { icon: 'fa-sun', color: '#FFD700' },
      'partly-cloudy': { icon: 'fa-cloud-sun', color: '#87CEEB' },
      'cloudy': { icon: 'fa-cloud', color: '#A9A9A9' },
      'rain': { icon: 'fa-cloud-rain', color: '#4682B4' },
      'thunderstorm': { icon: 'fa-bolt', color: '#9932CC' },
      'snow': { icon: 'fa-snowflake', color: '#E0FFFF' },
      'fog': { icon: 'fa-smog', color: '#D3D3D3' }
  };

  // Simulated Weather Data (would be replaced with API call)
  function getWeatherData() {
      const conditions = Object.keys(weatherConditions);
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      return {
          condition: randomCondition.replace('-', ' '),
          temp: Math.floor(Math.random() * 15 + 15) + '°C',
          humidity: Math.floor(Math.random() * 40 + 40) + '%',
          percentage: Math.floor(Math.random() * 30 + 70),
          type: randomCondition
      };
  }

  // Update Weather Display
  function updateWeather() {
      const weatherData = getWeatherData();
      const weatherConfig = weatherConditions[weatherData.type];
      
      // Update Text
      document.getElementById("weather-condition").textContent = weatherData.condition;
      document.getElementById("weather-temp").textContent = weatherData.temp;
      document.getElementById("weather-humidity").textContent = weatherData.humidity;
      
      // Update Icon
      const iconElement = document.getElementById("weather-icon");
      iconElement.className = `fas ${weatherConfig.icon}`;
      iconElement.style.color = weatherConfig.color;
      
      // Update Circular Chart
      updateWeatherChart(weatherData.percentage, weatherConfig.color);
  }

  // Circular Weather Chart
  function updateWeatherChart(percent, color) {
      const canvas = document.getElementById("weatherCircleChart");
      const ctx = canvas.getContext("2d");
      const radius = canvas.width / 2 - 5;
      const lineWidth = 6;
      const center = { x: canvas.width / 2, y: canvas.height / 2 };
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background Circle
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      
      // Progress Circle
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, -0.5 * Math.PI, (2 * Math.PI * percent / 100) - 0.5 * Math.PI);
      ctx.strokeStyle = color || '#00b894';
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Text inside (optional)
      ctx.fillStyle = (--text-primary);
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percent + "%", center.x, center.y);
  }

  // Initial Update
  updateWeather();
  
  // Simulate weather updates every 30 minutes
  setInterval(updateWeather, 1800000);
  
  // Handle window resize for chart
  window.addEventListener('resize', function() {
      const weatherData = getWeatherData();
      updateWeatherChart(weatherData.percentage, weatherConditions[weatherData.type].color);
  });
});