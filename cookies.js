// Cookie Consent Functions
function showCookieConsent() {
    if (!getCookie('cookie_consent')) {
        document.getElementById('cookie-consent').style.display = 'block';
    }
}

function hideCookieConsent() {
    document.getElementById('cookie-consent').style.display = 'none';
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

function acceptAllCookies() {
    setCookie('cookie_consent', 'all', 365);
    setCookie('analytics_cookies', 'true', 365);
    setCookie('marketing_cookies', 'true', 365);
    hideCookieConsent();
    showNotification('Cookie preferences saved successfully!', 'success');
}

function saveCookieSettings() {
    const analytics = document.getElementById('analytics-cookies').checked;
    const marketing = document.getElementById('marketing-cookies').checked;
    
    setCookie('cookie_consent', 'custom', 365);
    setCookie('analytics_cookies', analytics ? 'true' : 'false', 365);
    setCookie('marketing_cookies', marketing ? 'true' : 'false', 365);
    
    document.getElementById('cookie-settings-modal').style.display = 'none';
    hideCookieConsent();
    showNotification('Cookie preferences saved successfully!', 'success');
}

// Privacy Control Functions
function setupPrivacyControls() {
    // Load saved preferences
    const dataCollection = getCookie('data_collection') !== 'false';
    const personalizedAds = getCookie('personalized_ads') === 'true';
    const dataSharing = getCookie('data_sharing') === 'true';
    
    document.getElementById('data-collection').checked = dataCollection;
    document.getElementById('personalized-ads').checked = personalizedAds;
    document.getElementById('data-sharing').checked = dataSharing;
    
    // Add event listeners
    document.getElementById('data-collection').addEventListener('change', function() {
        setCookie('data_collection', this.checked ? 'true' : 'false', 365);
    });
    
    document.getElementById('personalized-ads').addEventListener('change', function() {
        setCookie('personalized_ads', this.checked ? 'true' : 'false', 365);
    });
    
    document.getElementById('data-sharing').addEventListener('change', function() {
        setCookie('data_sharing', this.checked ? 'true' : 'false', 365);
    });
    
    document.getElementById('export-data').addEventListener('click', function() {
        // In a real app, this would trigger a data export
        showNotification('Data export request received. We will email your data shortly.', 'success');
    });
    
    document.getElementById('delete-account').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // In a real app, this would trigger account deletion
            showNotification('Account deletion request received. We will process it within 48 hours.', 'success');
        }
    });
}

// Modal Functions
function setupModals() {
    const modal = document.getElementById('cookie-settings-modal');
    const closeBtn = document.querySelector('.close');
    
    document.getElementById('cookie-settings').addEventListener('click', function() {
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    document.getElementById('save-cookie-settings').addEventListener('click', saveCookieSettings);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    showCookieConsent();
    setupModals();
    setupPrivacyControls();
    
    document.getElementById('cookie-accept').addEventListener('click', acceptAllCookies);
});