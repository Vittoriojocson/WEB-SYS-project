/*
 * ============================================================================
 * ENVIRONMENT CONFIGURATION
 * ============================================================================
 * 
 * Automatically detects environment and sets the appropriate API URL
 * - Production: Uses deployed backend URL
 * - Development: Uses localhost
 */

const config = {
    // Change this to your deployed backend URL after deployment
    PRODUCTION_API_URL: 'https://web-sys-project.onrender.com',
    DEVELOPMENT_API_URL: 'http://localhost:5501',
    
    // Auto-detect environment
    get API_URL() {
        // Check if running on localhost or file://
        const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.protocol === 'file:';
        
        return isLocalhost ? this.DEVELOPMENT_API_URL : this.PRODUCTION_API_URL;
    }
};

// Make config available globally
window.APP_CONFIG = config;
