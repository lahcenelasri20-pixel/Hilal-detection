export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export const majorCities: City[] = [
  // Morocco
  { name: "Marrakesh", country: "Morocco", lat: 31.6295, lon: -7.9811 },
  { name: "Rabat", country: "Morocco", lat: 34.0209, lon: -6.8416 },
  { name: "Casablanca", country: "Morocco", lat: 33.5731, lon: -7.5898 },
  { name: "Fes", country: "Morocco", lat: 34.0181, lon: -5.0078 },
  { name: "Tangier", country: "Morocco", lat: 35.7595, lon: -5.8340 },
  { name: "Meknes", country: "Morocco", lat: 33.8935, lon: -5.5473 },
  { name: "Agadir", country: "Morocco", lat: 30.4278, lon: -9.5981 },
  { name: "Oujda", country: "Morocco", lat: 34.6814, lon: -1.9086 },
  { name: "Kenitra", country: "Morocco", lat: 34.2610, lon: -6.5802 },
  { name: "Tetouan", country: "Morocco", lat: 35.5889, lon: -5.3626 },
  
  // Saudi Arabia
  { name: "Mecca", country: "Saudi Arabia", lat: 21.4225, lon: 39.8262 },
  { name: "Medina", country: "Saudi Arabia", lat: 24.5247, lon: 39.5692 },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
  { name: "Jeddah", country: "Saudi Arabia", lat: 21.5433, lon: 39.1728 },
  { name: "Dammam", country: "Saudi Arabia", lat: 26.4207, lon: 50.0888 },
  
  // UAE
  { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708 },
  { name: "Abu Dhabi", country: "UAE", lat: 24.4539, lon: 54.3773 },
  { name: "Sharjah", country: "UAE", lat: 25.3463, lon: 55.4209 },
  
  // Turkey
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784 },
  { name: "Ankara", country: "Turkey", lat: 39.9334, lon: 32.8597 },
  { name: "Izmir", country: "Turkey", lat: 38.4237, lon: 27.1428 },
  
  // Egypt
  { name: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357 },
  { name: "Alexandria", country: "Egypt", lat: 31.2001, lon: 29.9187 },
  { name: "Giza", country: "Egypt", lat: 30.0131, lon: 31.2089 },
  
  // Europe
  { name: "London", country: "UK", lat: 51.5074, lon: -0.1278 },
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050 },
  { name: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038 },
  { name: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964 },
  { name: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041 },
  { name: "Brussels", country: "Belgium", lat: 50.8503, lon: 4.3517 },
  
  // North America
  { name: "New York", country: "USA", lat: 40.7128, lon: -74.0060 },
  { name: "Los Angeles", country: "USA", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", country: "USA", lat: 41.8781, lon: -87.6298 },
  { name: "Houston", country: "USA", lat: 29.7604, lon: -95.3698 },
  { name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832 },
  { name: "Montreal", country: "Canada", lat: 45.5017, lon: -73.5673 },
  
  // South Asia
  { name: "Karachi", country: "Pakistan", lat: 24.8607, lon: 67.0011 },
  { name: "Lahore", country: "Pakistan", lat: 31.5204, lon: 74.3587 },
  { name: "Islamabad", country: "Pakistan", lat: 33.6844, lon: 73.0479 },
  { name: "Delhi", country: "India", lat: 28.7041, lon: 77.1025 },
  { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777 },
  { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lon: 90.4125 },
  
  // Southeast Asia
  { name: "Jakarta", country: "Indonesia", lat: -6.2088, lon: 106.8456 },
  { name: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lon: 101.6869 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018 },
  { name: "Manila", country: "Philippines", lat: 14.5995, lon: 120.9842 },
  
  // Middle East
  { name: "Amman", country: "Jordan", lat: 31.9454, lon: 35.9284 },
  { name: "Beirut", country: "Lebanon", lat: 33.8886, lon: 35.4955 },
  { name: "Damascus", country: "Syria", lat: 33.5138, lon: 36.2765 },
  { name: "Baghdad", country: "Iraq", lat: 33.3152, lon: 44.3661 },
  { name: "Tehran", country: "Iran", lat: 35.6892, lon: 51.3890 },
  { name: "Kuwait City", country: "Kuwait", lat: 29.3759, lon: 47.9774 },
  { name: "Doha", country: "Qatar", lat: 25.2854, lon: 51.5310 },
  { name: "Muscat", country: "Oman", lat: 23.5880, lon: 58.3829 },
  
  // North Africa
  { name: "Algiers", country: "Algeria", lat: 36.7538, lon: 3.0588 },
  { name: "Tunis", country: "Tunisia", lat: 36.8065, lon: 10.1815 },
  { name: "Tripoli", country: "Libya", lat: 32.8872, lon: 13.1913 },
  
  // West Africa
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792 },
  { name: "Abuja", country: "Nigeria", lat: 9.0765, lon: 7.3986 },
  { name: "Dakar", country: "Senegal", lat: 14.7167, lon: -17.4677 },
  
  // East Africa
  { name: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219 },
  { name: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lon: 39.2083 },
  { name: "Addis Ababa", country: "Ethiopia", lat: 9.0320, lon: 38.7469 },
  
  // Australia
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631 },
  { name: "Brisbane", country: "Australia", lat: -27.4698, lon: 153.0251 }
];
