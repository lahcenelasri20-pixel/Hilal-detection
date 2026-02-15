# 🌙 Ramadan Moon Visibility Calculator

A beautiful, user-friendly web application to calculate when the new moon will be visible in your location.

## 📁 Project Files

```
lunar-calculator-project/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── cities.js           # Database of major cities worldwide
├── calculator.js       # Lunar calculation functions
├── app.js             # Main application logic
└── README.md          # This file
```

## 🚀 How to Run

### Option 1: Direct Open (Simplest)
1. Open `index.html` directly in your web browser
2. That's it! The app will work immediately

### Option 2: Using VS Code
1. Open the project folder in VS Code
2. Install "Live Server" extension (if not installed)
3. Right-click on `index.html`
4. Select "Open with Live Server"
5. The app will open in your default browser

### Option 3: Local Web Server
```bash
# If you have Python installed
python -m http.server 8000

# Or with Node.js
npx http-server

# Then open: http://localhost:8000
```

## ✨ Features

### Simple Mode (Default)
- **City Selection**: Type any city and get autocomplete suggestions
- **GPS Detection**: Click "Use My Location" for automatic detection
- **Month Picker**: Select any month to check
- **One-Click Calculation**: Everything calculated automatically
- **Beautiful Results**: Clear visibility status with details

### Advanced Mode
- Manual input of astronomical parameters
- For experts who have precise data
- Direct control over calculations

## 🌍 Supported Cities

The app includes 70+ major cities worldwide:
- **Morocco**: Marrakesh, Rabat, Casablanca, Fes, Tangier, etc.
- **Middle East**: Mecca, Medina, Dubai, Istanbul, Cairo, etc.
- **Europe**: London, Paris, Berlin, Madrid, Rome, etc.
- **Americas**: New York, Los Angeles, Toronto, etc.
- **Asia**: Jakarta, Kuala Lumpur, Singapore, etc.
- **Africa**: Lagos, Nairobi, Dakar, etc.
- **Australia**: Sydney, Melbourne, Brisbane

## 🔧 Technical Details

### Technologies Used
- Pure HTML5
- CSS3 with modern gradients and animations
- Vanilla JavaScript (no dependencies)
- Responsive design for all devices

### Calculation Method
The app uses the astronomical formula from your handwritten notes:

```
cos(λT - λS) = cos β × [√(1 - (sin β / sin Max β)²) × cos φ + (sin β / sin Max β) × (sin φ / cos φ)]
```

Where:
- λT - λS: Angular separation between Sun and Moon
- β: Moon's declination
- φ: Angular parameter
- Visibility threshold: ≥ 10°

## 📱 Browser Compatibility

Works on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## 🎨 Customization

### Change Colors
Edit `styles.css`, look for these gradients:
```css
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
```

### Add More Cities
Edit `cities.js` and add to the `majorCities` array:
```javascript
{ name: "YourCity", country: "YourCountry", lat: XX.XXXX, lon: XX.XXXX }
```

### Adjust Calculations
Edit `calculator.js` to modify the lunar calculation algorithms.

## 📝 Notes

### Important
The lunar calculations in this app are **simplified approximations** for demonstration purposes. 

For production use with real Islamic calendar calculations, you should:
1. Use a proper astronomical ephemeris library (e.g., Astronomy Engine)
2. Integrate with services like:
   - NASA JPL HORIZONS
   - Islamic Finder API
   - HijriCalendar API
3. Account for:
   - Precise topocentric coordinates
   - Atmospheric refraction
   - Lunar libration
   - Local horizon conditions

### Future Enhancements
- [ ] Integration with real astronomical API
- [ ] Historical data analysis
- [ ] Prayer times calculation
- [ ] Share results feature
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Save favorite locations

## 🤝 Contributing

Feel free to:
- Add more cities
- Improve calculations
- Enhance the design
- Fix bugs
- Add features

## 📄 License

Free to use for personal and educational purposes.

## 🙏 Credits

Based on the astronomical calculations and formulas used in Islamic calendar determination.

---

**Made with ❤️ for the Muslim community worldwide** 🌙
