# Browser Home Dashboard

Personal browser home dashboard with weather, crypto, and quick links widgets.

## Features

- **Weather Widget**: Displays current weather conditions, temperature, humidity, precipitation, and more
- **Crypto Widget**: Shows real-time cryptocurrency prices (BTC, ETH, SOL, XRP, USDC) with 1h/24h/7d changes
- **Quick Links**: Organized categorized links with custom icons
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Dynamic Content**: All widgets are generated dynamically via JavaScript

### To Run Locally

Simply open `index.html` in a web browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## Security

Both `js/config.js` and `data/links.json` are gitignored and will not be committed to the repository.
