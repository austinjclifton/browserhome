/**
 * Crypto Widget Module
 * Fetches and displays cryptocurrency data
 */

const cryptoIds = ['xrp-xrp', 'btc-bitcoin', 'eth-ethereum', 'sol-solana', 'usdc-usd-coin'];

/**
 * Creates crypto banner
 */
function createCryptoBanner() {
    const banner = document.createElement('div');
    banner.className = 'cryptoBanner';
    banner.setAttribute('role', 'row');
    banner.setAttribute('aria-label', 'Cryptocurrency table header');

    const nameP = document.createElement('p');
    nameP.className = 'banner1';
    nameP.textContent = 'Name';
    nameP.setAttribute('aria-label', 'Cryptocurrency name column');

    const priceP = document.createElement('p');
    priceP.className = 'banner2';
    priceP.textContent = 'Current Price';
    priceP.setAttribute('aria-label', 'Current price column');

    const changesP = document.createElement('p');
    changesP.className = 'banner3';
    changesP.textContent = '1h/24h/7d';
    changesP.setAttribute('aria-label', 'Price change columns');

    banner.appendChild(nameP);
    banner.appendChild(priceP);
    banner.appendChild(changesP);

    return banner;
}

/**
 * Creates a crypto block element
 */
function createCryptoBlock(data) {
    const listBlock = document.createElement('div');
    listBlock.className = 'listBlock';
    listBlock.setAttribute('role', 'row');
    listBlock.setAttribute('aria-label', `${data.name} cryptocurrency data`);

    const symbol = document.createElement('div');
    symbol.className = 'listBlockSymbol';
    symbol.textContent = data.symbol;

    const name = document.createElement('span');
    name.className = 'listBlockName';
    name.textContent = data.name;

    symbol.appendChild(name);

    const price = document.createElement('div');
    price.className = 'listBlockPrice';
    price.textContent = `$${data.quotes.USD.price.toLocaleString('en-US', { 
        maximumFractionDigits: 2, 
        minimumFractionDigits: 2 
    })}`;
    price.setAttribute('aria-label', `Current price: $${data.quotes.USD.price}`);

    const pricesDiv = document.createElement('div');
    pricesDiv.className = 'listBlockPriceChanges';

    const changes = [
        { key: 'percent_change_1h', className: 'listBlock1h', label: '1 hour' },
        { key: 'percent_change_24h', className: 'listBlock24h', label: '24 hours' },
        { key: 'percent_change_7d', className: 'listBlock7d', label: '7 days' }
    ];

    changes.forEach(({ key, className, label }) => {
        const change = data.quotes.USD[key];
        const formatted = change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
        const changeDiv = document.createElement('div');
        changeDiv.className = className;
        changeDiv.textContent = `${formatted}%`;
        changeDiv.setAttribute('aria-label', `${label} change: ${formatted}%`);
        pricesDiv.appendChild(changeDiv);
    });

    // Set background color class based on 24h change
    const change24h = data.quotes.USD.percent_change_24h;
    if (change24h < 0) {
        listBlock.classList.add('negative');
    } else if (change24h > 0) {
        listBlock.classList.add('positive');
    } else {
        listBlock.classList.add('neutral');
    }

    listBlock.appendChild(symbol);
    listBlock.appendChild(price);
    listBlock.appendChild(pricesDiv);

    return listBlock;
}

/**
 * Creates the crypto container structure
 */
function createCryptoContainer() {
    const container = document.createElement('section');
    container.className = 'widget cryptoContainer';
    container.id = 'cryptoContainer';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Cryptocurrency prices');
    return container;
}

/**
 * Initializes crypto widget
 */
export async function initCrypto() {
    // Create crypto container structure
    const mainContainer = document.querySelector('main.container');
    if (!mainContainer) {
        console.error('Main container not found');
        return;
    }
    
    const cryptoContainer = createCryptoContainer();
    mainContainer.appendChild(cryptoContainer);

    // Create banner
    const banner = createCryptoBanner();
    cryptoContainer.appendChild(banner);

    // Fetch crypto data
    try {
        const results = await Promise.allSettled(
            cryptoIds.map(id =>
                fetch(`https://api.coinpaprika.com/v1/tickers/${id}`)
                    .then(r => {
                        if (!r.ok) {
                            throw new Error(`HTTP ${r.status}: ${r.statusText}`);
                        }
                        return r.json();
                    })
                    .catch(err => {
                        if (err.message) throw err;
                        throw new Error('Network error or CORS blocked');
                    })
            )
        );

        const successfulResults = results.filter(r => r.status === 'fulfilled');
        if (successfulResults.length === 0) {
            const firstError = results.find(r => r.status === 'rejected');
            let errorDetail = 'API unavailable';
            
            if (firstError?.reason) {
                const errorMsg = firstError.reason.message || String(firstError.reason);
                if (errorMsg.includes('CORS') || errorMsg.includes('blocked')) {
                    errorDetail = 'CORS policy blocked the request';
                } else if (errorMsg.includes('402') || errorMsg.includes('Payment')) {
                    errorDetail = 'API requires payment (402)';
                } else if (errorMsg.includes('Network')) {
                    errorDetail = 'Network error or connection failed';
                } else {
                    errorDetail = errorMsg;
                }
            }
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'cryptoError';
            errorMsg.innerHTML = `
                <div class="cryptoErrorTitle">Unable to load cryptocurrency data</div>
                <div class="cryptoErrorDetail">${errorDetail}</div>
            `;
            cryptoContainer.appendChild(errorMsg);
            return;
        }

        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                const cryptoBlock = createCryptoBlock(result.value);
                cryptoContainer.appendChild(cryptoBlock);
            }
        });
    } catch (error) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'cryptoError';
        errorMsg.innerHTML = `
            <div class="cryptoErrorTitle">Unable to load cryptocurrency data</div>
            <div class="cryptoErrorDetail">${error.message || 'Network or API error'}</div>
        `;
        cryptoContainer.appendChild(errorMsg);
    }
}
