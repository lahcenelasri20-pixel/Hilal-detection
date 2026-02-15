// Main application logic

let selectedCity = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set default month to current month
    const today = new Date();
    document.getElementById('month').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    // Setup city autocomplete
    setupCityAutocomplete();
    
    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        const citySuggestions = document.getElementById('citySuggestions');
        const cityInput = document.getElementById('city');
        if (!citySuggestions.contains(e.target) && e.target !== cityInput) {
            citySuggestions.classList.remove('active');
        }
    });
});

/**
 * Setup city autocomplete functionality
 */
function setupCityAutocomplete() {
    const cityInput = document.getElementById('city');
    const citySuggestions = document.getElementById('citySuggestions');
    
    cityInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            citySuggestions.classList.remove('active');
            return;
        }
        
        // Filter cities based on query
        const matches = majorCities.filter(city => 
            city.name.toLowerCase().includes(query) || 
            city.country.toLowerCase().includes(query)
        ).slice(0, 5); // Limit to 5 results
        
        if (matches.length > 0) {
            citySuggestions.innerHTML = matches.map(city => `
                <div class="city-item" onclick="selectCity('${city.name}', '${city.country}', ${city.lat}, ${city.lon})">
                    <div class="city-name">${city.name}</div>
                    <div class="city-country">${city.country}</div>
                </div>
            `).join('');
            citySuggestions.classList.add('active');
        } else {
            citySuggestions.classList.remove('active');
        }
    });
}

/**
 * Select a city from autocomplete
 * @param {string} name - City name
 * @param {string} country - Country name
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
function selectCity(name, country, lat, lon) {
    selectedCity = { name, country, lat, lon };
    document.getElementById('city').value = `${name}, ${country}`;
    document.getElementById('citySuggestions').classList.remove('active');
    document.getElementById('locationStatus').textContent = '✓ Location set';
}

/**
 * Detect user's current location using geolocation API
 */
function detectLocation() {
    if (!navigator.geolocation) {
        alert('❌ Geolocation is not supported by your browser');
        return;
    }
    
    document.getElementById('locationStatus').textContent = 'Getting location...';
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            selectedCity = {
                name: 'Your Location',
                country: '',
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            document.getElementById('city').value = 'Your Current Location';
            document.getElementById('locationStatus').textContent = '✓ Location detected';
        },
        function(error) {
            document.getElementById('locationStatus').textContent = '✗ Could not detect location';
            alert('❌ Could not get your location. Please enter your city manually.\n\nError: ' + error.message);
        }
    );
}

/**
 * Calculate moon visibility in simple mode
 */
function calculateSimple() {
    const monthInput = document.getElementById('month').value;
    
    // Validate inputs
    if (!selectedCity) {
        alert('⚠️ Please enter your city or use location detection');
        return;
    }
    
    if (!monthInput) {
        alert('⚠️ Please select a month');
        return;
    }
    
    // Show loading state
    document.getElementById('loading').classList.add('active');
    document.getElementById('result').classList.remove('visible');
    
    // Simulate calculation with setTimeout
    // In a real app, this could be an API call to an astronomical service
    setTimeout(() => {
        try {
            // Parse the selected month
            const [year, month] = monthInput.split('-');
            const date = new Date(year, parseInt(month) - 1, 1);
            
            // Calculate lunar parameters
            const moonAge = calculateMoonAge(date);
            const newMoonDate = findNewMoon(date);
            
            // Generate lunar parameters based on location and date
            const params = generateLunarParameters(newMoonDate, selectedCity);
            
            // Calculate visibility
            const result = calculateVisibility(
                params.beta,
                params.maxBeta,
                params.phi,
                params.sinPhi
            );
            
            // Display results
            displayResult(result, newMoonDate, selectedCity, moonAge);
            
        } catch (error) {
            alert('❌ Error during calculation: ' + error.message);
            console.error('Calculation error:', error);
        } finally {
            document.getElementById('loading').classList.remove('active');
        }
    }, 1500);
}

/**
 * Calculate moon visibility in advanced mode
 */
function calculateAdvanced() {
    // Get input values
    const beta = parseFloat(document.getElementById('beta').value);
    const maxBeta = parseFloat(document.getElementById('maxBeta').value);
    const phi = parseFloat(document.getElementById('phi').value);
    const sinPhi = parseFloat(document.getElementById('sinPhi').value);
    
    // Validate inputs
    if (isNaN(beta) || isNaN(maxBeta) || isNaN(phi) || isNaN(sinPhi)) {
        alert('⚠️ Please fill in all fields with valid numbers');
        return;
    }
    
    // Calculate visibility
    const result = calculateVisibility(beta, maxBeta, phi, sinPhi);
    
    // Display in simple format
    const today = new Date();
    displayResult(result, today, { name: 'Custom Location', country: '' }, 15);
}

/**
 * Display calculation results
 * @param {Object} result - Calculation result object
 * @param {Date} newMoonDate - Date of new moon
 * @param {Object} location - Location object
 * @param {number} moonAge - Age of moon in days
 */
function displayResult(result, newMoonDate, location, moonAge) {
    const resultDiv = document.getElementById('result');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    // Calculate visibility date (day after new moon)
    const visibilityDate = new Date(newMoonDate);
    visibilityDate.setDate(visibilityDate.getDate() + 1);
    
    // Update result display based on visibility
    if (result.isVisible) {
        resultDiv.classList.remove('not-visible-result');
        document.getElementById('resultIcon').textContent = '✅';
        document.getElementById('resultTitle').textContent = 'Moon Will Be Visible!';
        document.getElementById('resultDate').textContent = visibilityDate.toLocaleDateString('en-US', options);
    } else {
        resultDiv.classList.add('not-visible-result');
        document.getElementById('resultIcon').textContent = '❌';
        document.getElementById('resultTitle').textContent = 'Moon Not Visible';
        document.getElementById('resultDate').textContent = visibilityDate.toLocaleDateString('en-US', options);
    }
    
    // Update result values
    document.getElementById('angularSep').textContent = result.angularSep.toFixed(2) + '°';
    document.getElementById('moonAge').textContent = moonAge.toFixed(1) + ' days';
    document.getElementById('locationName').textContent = `${location.name}${location.country ? ', ' + location.country : ''}`;
    
    // Calculate and display sunset time
    const sunsetTime = calculateSunsetTime(location.lat, visibilityDate);
    document.getElementById('sunsetTime').textContent = sunsetTime;
    
    // Show result with animation
    resultDiv.classList.add('visible');
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Toggle between simple and advanced modes
 */
function toggleMode() {
    const simpleMode = document.getElementById('simpleMode');
    const advancedMode = document.getElementById('advancedMode');
    const toggleText = document.getElementById('modeToggleText');
    
    if (simpleMode.style.display !== 'none') {
        // Switch to advanced mode
        simpleMode.style.display = 'none';
        advancedMode.style.display = 'block';
        toggleText.textContent = '👤 Simple Mode';
    } else {
        // Switch to simple mode
        simpleMode.style.display = 'block';
        advancedMode.style.display = 'none';
        toggleText.textContent = '🔧 Advanced Mode (for experts)';
    }
}
