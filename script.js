// Price Arbitrage App - Main JavaScript
class PriceArbitrageApp {
    constructor() {
        this.products = this.getSampleProducts();
        this.init();
    }

    init() {
        this.displayProducts();
        this.setupEventListeners();
        this.loadSettings();
    }

    getSampleProducts() {
        return [
            {
                id: 1,
                name: "iPhone 15 Pro Max",
                image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=2560&hei=1440&fmt=p-jpg&qlt=80&.v=1692846359310",
                prices: [
                    { country: "US", price: 1199, currency: "USD", store: "Amazon", savings: 0 },
                    { country: "JP", price: 148000, currency: "JPY", store: "Amazon JP", savings: 15 },
                    { country: "DE", price: 1099, currency: "EUR", store: "Amazon DE", savings: 8 }
                ],
                affiliateLink: "#"
            },
            {
                id: 2,
                name: "PlayStation 5 Digital",
                image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-digital-edition-product-thumbnail-01-en-21sep21?$1600px$",
                prices: [
                    { country: "US", price: 399, currency: "USD", store: "BestBuy", savings: 0 },
                    { country: "JP", price: 49980, currency: "JPY", store: "Amazon JP", savings: 12 },
                    { country: "UK", price: 349, currency: "GBP", store: "Amazon UK", savings: 10 }
                ],
                affiliateLink: "#"
            },
            {
                id: 3,
                name: "MacBook Pro 16-inch",
                image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-silver-select-202301?wid=2000&hei=2000&fmt=jpeg&qlt=90&.v=1671304673222",
                prices: [
                    { country: "US", price: 2499, currency: "USD", store: "Apple", savings: 0 },
                    { country: "CA", price: 2999, currency: "CAD", store: "Amazon CA", savings: 5 },
                    { country: "AU", price: 3699, currency: "AUD", store: "Amazon AU", savings: 7 }
                ],
                affiliateLink: "#"
            }
        ];
    }

    displayProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        grid.innerHTML = this.products.map(product => `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        ${this.renderPriceComparison(product)}
                    </div>
                    <div class="card-footer bg-white border-0">
                        <button class="btn btn-buy w-100" onclick="app.trackClick(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Buy Now & Save
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderPriceComparison(product) {
        const bestDeal = product.prices.reduce((best, current) => 
            current.savings > best.savings ? current : best
        );

        return `
            <div class="price-comparison">
                ${product.prices.map(price => `
                    <div class="d-flex justify-content-between align-items-center mb-2 p-2 ${price.country === bestDeal.country ? 'bg-success bg-opacity-10 rounded' : ''}">
                        <div class="d-flex align-items-center">
                            <span class="me-2">${this.getFlagEmoji(price.country)}</span>
                            <span>${price.country}</span>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold">${this.formatCurrency(price.price, price.currency)}</div>
                            ${price.savings > 0 ? `
                                <small class="text-success">
                                    <i class="fas fa-arrow-down"></i> Save ${price.savings}%
                                </small>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
                
                ${bestDeal.savings > 0 ? `
                    <div class="alert alert-success mt-3">
                        <i class="fas fa-trophy"></i> Best deal: ${bestDeal.country} 
                        (Save ${bestDeal.savings}% - ${this.formatCurrency(
                            product.prices[0].price - this.convertPrice(bestDeal.price, bestDeal.currency, 'USD'), 
                            'USD'
                        )})
                    </div>
                ` : ''}
            </div>
        `;
    }

    getFlagEmoji(countryCode) {
        const flagEmojis = {
            US: '🇺🇸', JP: '🇯🇵', DE: '🇩🇪', UK: '🇬🇧', 
            CA: '🇨🇦', AU: '🇦🇺', FR: '🇫🇷', IT: '🇮🇹'
        };
        return flagEmojis[countryCode] || '🌍';
    }

    formatCurrency(amount, currency) {
        const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$' };
        const symbol = symbols[currency] || currency;
        
        if (currency === 'JPY') {
            return `${symbol}${Math.round(amount).toLocaleString()}`;
        }
        
        return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    convertPrice(amount, fromCurrency, toCurrency) {
        // Simple conversion rates (in real app, use API)
        const rates = {
            USD: 1, EUR: 0.85, GBP: 0.75, JPY: 110, CAD: 1.25, AUD: 1.30
        };
        return (amount / rates[fromCurrency]) * rates[toCurrency];
    }

    searchProducts() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        if (!query) {
            this.displayProducts();
            return;
        }

        const filtered = this.products.filter(product =>
            product.name.toLowerCase().includes(query)
        );
        
        this.displayFilteredProducts(filtered);
    }

    displayFilteredProducts(products) {
        const grid = document.getElementById('productsGrid');
        if (products.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No products found</h4>
                    <p>Try searching for "iPhone", "PlayStation", or "MacBook"</p>
                </div>
            `;
        } else {
            this.products = products;
            this.displayProducts();
        }
    }

    trackClick(productId) {
        // Track affiliate clicks
        console.log('Product clicked:', productId);
        alert('This would redirect to Amazon with your affiliate tag!');
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchProducts();
                }
            });
        }
    }

    loadSettings() {
        // Load saved settings from localStorage
        const settings = JSON.parse(localStorage.getItem('priceArbitrageSettings') || '{}');
        if (settings.amazonTag) {
            console.log('Loaded affiliate tag:', settings.amazonTag);
        }
    }
}

// Initialize app
const app = new PriceArbitrageApp();

// Global functions for HTML onclick
function searchProducts() {
    app.searchProducts();
}

// Admin functionality
if (window.location.pathname.includes('admin.html')) {
    function saveSettings() {
        const settings = {
            amazonTag: document.getElementById('amazonTag').value,
            serpapiKey: document.getElementById('serpapiKey').value,
            stripeKey: document.getElementById('stripeKey').value
        };
        localStorage.setItem('priceArbitrageSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    }

    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('priceArbitrageSettings') || '{}');
        document.getElementById('amazonTag').value = settings.amazonTag || '';
        document.getElementById('serpapiKey').value = settings.serpapiKey || '';
        document.getElementById('stripeKey').value = settings.stripeKey || '';
    }

    // Load settings when admin page loads
    document.addEventListener('DOMContentLoaded', loadSettings);
}
// Add these methods to your existing PriceArbitrageApp class:

class PriceArbitrageApp {
    // ... existing code ...

    async searchRealPrices(query, country = 'us') {
        try {
            this.showLoading(true);
            
            const response = await fetch(`/.netlify/functions/scrape-prices?product=${encodeURIComponent(query)}&country=${country}`);
            const data = await response.json();
            
            if (data.success) {
                this.displayRealPrices(data.prices, query);
            } else {
                this.showError('Failed to fetch prices');
            }
        } catch (error) {
            console.error('Error fetching prices:', error);
            this.showError('Network error. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async generateAffiliateLink(product, country) {
        try {
            const response = await fetch('/.netlify/functions/generate-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product, country })
            });
            
            const data = await response.json();
            return data.affiliateLink;
        } catch (error) {
            console.error('Error generating affiliate link:', error);
            return '#'; // Fallback link
        }
    }

    displayRealPrices(prices, query) {
        const grid = document.getElementById('productsGrid');
        
        if (!prices || prices.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No prices found for "${query}"</h4>
                    <p>Try a different search term or check your API keys</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = prices.map((item, index) => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h6 class="card-title">${item.title}</h6>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="price-badge">${item.currency} ${item.price}</span>
                            <span class="store-badge">${item.store}</span>
                        </div>
                        <div class="rating">
                            ${this.generateStars(item.rating)}
                            <small class="text-muted">(${item.reviews} reviews)</small>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0">
                        <button class="btn btn-buy w-100" onclick="app.handleAffiliateClick('${item.link}', '${item.title}')">
                            <i class="fas fa-shopping-cart"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async handleAffiliateClick(originalLink, productName) {
        try {
            // Generate affiliate link
            const affiliateLink = await this.generateAffiliateLink(productName, 'us');
            
            // Track the click (you can add analytics here)
            this.trackAffiliateClick(productName);
            
            // Open the affiliate link in new tab
            window.open(affiliateLink, '_blank');
            
        } catch (error) {
            // Fallback to original link
            window.open(originalLink, '_blank');
        }
    }

    trackAffiliateClick(productName) {
        // Here you can add analytics tracking
        console.log('Affiliate click tracked:', productName);
        // Integrate with Google Analytics, Facebook Pixel, etc.
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }
        
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        
        return stars;
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4>Error</h4>
                <p>${message}</p>
                <button class="btn btn-primary mt-2" onclick="app.searchProducts()">
                    Try Again
                </button>
            </div>
        `;
    }
}