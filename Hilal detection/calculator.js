// Lunar visibility calculation functions

/**
 * Calculate the age of the moon for a given date
 * @param {Date} date - The date to calculate moon age for
 * @returns {number} - Moon age in days
 */
function calculateMoonAge(date) {
    // Known new moon reference point
    const knownNewMoon = new Date(2000, 0, 6, 18, 14);
    const synodicMonth = 29.53058867; // Average lunar month in days
    
    // Calculate difference in days
    const diff = (date - knownNewMoon) / (1000 * 60 * 60 * 24);
    
    // Calculate moon age
    const age = diff % synodicMonth;
    return age < 0 ? age + synodicMonth : age;
}

/**
 * Find the approximate new moon date for a given month
 * @param {Date} date - The date to search around
 * @returns {Date} - The approximate new moon date
 */
function findNewMoon(date) {
    const age = calculateMoonAge(date);
    
    // Calculate days to next new moon
    const daysToNewMoon = age < 15 ? -age : (29.53 - age);
    
    const newMoon = new Date(date);
    newMoon.setDate(newMoon.getDate() + Math.round(daysToNewMoon));
    
    return newMoon;
}

/**
 * Calculate lunar visibility using astronomical formulas
 * @param {number} beta - Moon's declination in degrees
 * @param {number} maxBeta - Maximum declination in degrees
 * @param {number} phi - Angular parameter in degrees
 * @param {number} sinPhi - Sine of phi
 * @returns {Object} - Object containing angular separation and visibility status
 */
function calculateVisibility(beta, maxBeta, phi, sinPhi) {
    // Convert to radians
    const betaRad = beta * Math.PI / 180;
    const maxBetaRad = maxBeta * Math.PI / 180;
    const phiRad = phi * Math.PI / 180;

    // Calculate trigonometric values
    const cosBeta = Math.cos(betaRad);
    const sinBeta = Math.sin(betaRad);
    const sinMaxBeta = Math.sin(maxBetaRad);

    // Calculate the ratio sin β / sin Max β
    const ratio = sinBeta / sinMaxBeta;
    
    // Calculate first term: √[1 - (sin β / sin Max β)²]
    const term1 = Math.sqrt(1 - ratio * ratio);
    
    // Calculate second term: (sin β / sin Max β) × (sin φ / cos φ)
    const term2 = ratio * (sinPhi / Math.cos(phiRad));

    // Calculate cos(λ_T - λ_S) = cos β × [term1 × cos φ + term2]
    const cosResult = cosBeta * (term1 * Math.cos(phiRad) + term2);

    // Calculate angular separation λ_T - λ_S in degrees
    const angularSep = Math.acos(cosResult) * 180 / Math.PI;

    // Determine visibility (threshold is 10°)
    const isVisible = angularSep >= 10;

    return {
        angularSep: angularSep,
        isVisible: isVisible,
        details: {
            cosBeta: cosBeta,
            sinBeta: sinBeta,
            ratio: ratio,
            term1: term1,
            term2: term2,
            cosResult: cosResult
        }
    };
}

/**
 * Generate simplified lunar parameters based on date and location
 * This is a simplified approximation for demonstration purposes
 * In a production app, you would use a proper astronomical library or API
 * @param {Date} date - The date to calculate for
 * @param {Object} location - Location object with lat and lon
 * @returns {Object} - Object containing beta, maxBeta, phi, and sinPhi
 */
function generateLunarParameters(date, location) {
    // This is a simplified calculation
    // In reality, you would need:
    // 1. Precise ephemeris data (JPL HORIZONS, or similar)
    // 2. Topocentric coordinates calculation
    // 3. Atmospheric refraction corrections
    // 4. Precise lunar libration data
    
    // For now, we'll use approximations with some randomness
    // to simulate the variation in lunar parameters
    
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const latitudeEffect = Math.sin(location.lat * Math.PI / 180);
    
    // Approximate beta (moon's declination)
    // Varies between -5° and +5° approximately
    const beta = -4.48 + Math.sin(dayOfYear / 365 * 2 * Math.PI) * 2 + (Math.random() * 1 - 0.5);
    
    // Maximum beta (typically around 5.145°)
    const maxBeta = 5.148;
    
    // Phi (angular parameter related to moon-sun separation)
    // Varies based on lunar phase and position
    const phi = 1.22 + Math.sin(dayOfYear / 29.53 * 2 * Math.PI) * 0.5 + (Math.random() * 0.3 - 0.15);
    
    // Calculate sin phi
    const sinPhi = Math.sin(phi * Math.PI / 180);
    
    return {
        beta: beta,
        maxBeta: maxBeta,
        phi: phi,
        sinPhi: sinPhi
    };
}

/**
 * Calculate approximate sunset time based on latitude and date
 * @param {number} latitude - Latitude in degrees
 * @param {Date} date - Date to calculate for
 * @returns {string} - Approximate sunset time
 */
function calculateSunsetTime(latitude, date) {
    // Simplified calculation
    // In reality, you would use a proper astronomical library
    
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Base sunset time (18:00)
    let sunsetHour = 18;
    
    // Adjust for latitude
    sunsetHour += Math.sin(latitude * Math.PI / 180) * 2;
    
    // Adjust for time of year (approximation of equation of time)
    const seasonalAdjustment = Math.sin((dayOfYear - 80) / 365 * 2 * Math.PI) * 0.5;
    sunsetHour += seasonalAdjustment;
    
    // Round to nearest 15 minutes
    const totalMinutes = Math.round(sunsetHour * 4) * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
