// ==================== BOOKING PAGE FUNCTIONALITY ====================
/**
 * Handles the booking page functionality
 * - Loads package and drinks info from session storage
 * - Manages add-ons selection and pricing
 * - Updates total price dynamically
 * - Proceeds to contact form with booking info
 */

const TRANSPORT_FEE = 2000;
const BEER_BAR_BASE_PRICE = 7000;
const BEER_BAR_STEP_PRICE = 500;
const GUEST_TIER_STEPS = [30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500];

let selectedAddons = [];
let basePrice = 0;

// Initialize booking page
function initializeBooking() {
    const packageInfo = JSON.parse(sessionStorage.getItem('packageInfo'));
    const selectedDrinks = JSON.parse(sessionStorage.getItem('selectedDrinks')) || [];

    if (packageInfo) {
        // Update package display
        document.getElementById('bookingPackageName').textContent = `${packageInfo.tier} - ${packageInfo.name}`;
        document.getElementById('bookingPackagePrice').textContent = packageInfo.price;
        document.getElementById('bookingPackageDesc').textContent = packageInfo.description;

        // Extract base price (first number from price string)
        const priceMatch = packageInfo.price.match(/₱([\d,]+)/);
        if (priceMatch) {
            basePrice = parseInt(priceMatch[1].replace(/,/g, '')) || 7000;
        } else {
            basePrice = 7000;
        }
    }

    // Set dynamic Beer Bar add-on pricing based on selected package size
    applyDynamicBeerBarPrice(packageInfo);

    // Display drinks
    displaySelectedDrinks(selectedDrinks);

    // Setup add-on listeners
    setupAddonCheckboxes();

    // Setup customization listeners
    setupCustomizations();

    // Update price summary
    updatePriceSummary();
}

function extractPackageSize(packageInfo) {
    if (!packageInfo) return GUEST_TIER_STEPS[0];

    const packageText = `${packageInfo.name || ''} ${packageInfo.description || ''}`;

    const paxRangeMatch = packageText.match(/(\d+)\s*-\s*(\d+)\s*Pax/i);
    if (paxRangeMatch) {
        return parseInt(paxRangeMatch[1], 10);
    }

    const paxMatch = packageText.match(/(\d+)\s*Pax/i);
    if (paxMatch) {
        return parseInt(paxMatch[1], 10);
    }

    const drinksMatch = packageText.match(/(\d+)\s*Drinks/i);
    if (drinksMatch) {
        return parseInt(drinksMatch[1], 10);
    }

    const fallbackNumber = packageText.match(/(\d+)/);
    if (fallbackNumber) {
        return parseInt(fallbackNumber[1], 10);
    }

    return GUEST_TIER_STEPS[0];
}

function calculateBeerBarPrice(packageSize) {
    const tierIndex = GUEST_TIER_STEPS.findIndex(tier => packageSize <= tier);
    const resolvedIndex = tierIndex === -1 ? GUEST_TIER_STEPS.length - 1 : tierIndex;
    return BEER_BAR_BASE_PRICE + (resolvedIndex * BEER_BAR_STEP_PRICE);
}

function applyDynamicBeerBarPrice(packageInfo) {
    const beerCheckbox = document.querySelector('.addon-checkbox[data-addon="beer"]');
    if (!beerCheckbox) return;

    const packageSize = extractPackageSize(packageInfo);
    const beerBarPrice = calculateBeerBarPrice(packageSize);

    beerCheckbox.setAttribute('data-price', String(beerBarPrice));

    const addonItem = beerCheckbox.closest('.addon-item');
    const addonPriceEl = addonItem ? addonItem.querySelector('.addon-price') : null;
    if (addonPriceEl) {
        addonPriceEl.textContent = `₱${beerBarPrice.toLocaleString()}`;
    }
}

// Display selected drinks
function displaySelectedDrinks(drinks) {
    const drinksList = document.getElementById('bookingDrinksList');
    
    if (drinks.length === 0) {
        drinksList.innerHTML = '<p class="empty">No drinks selected</p>';
        return;
    }

    let html = '<ul class="drinks-items">';
    drinks.forEach(drink => {
        html += `<li>${drink}</li>`;
    });
    html += '</ul>';
    drinksList.innerHTML = html;
}

// Setup add-on checkbox listeners
function setupAddonCheckboxes() {
    const checkboxes = document.querySelectorAll('.addon-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateSelectedAddons();
            updatePriceSummary();
        });
    });
}

// Update selected add-ons array
function updateSelectedAddons() {
    const checkboxes = document.querySelectorAll('.addon-checkbox:checked');
    selectedAddons = [];

    checkboxes.forEach(checkbox => {
        const addon = {
            name: checkbox.parentElement.querySelector('h4').textContent,
            price: parseInt(checkbox.getAttribute('data-price'))
        };
        selectedAddons.push(addon);
    });
}

// Setup customization checkboxes
function setupCustomizations() {
    const customizations = document.querySelectorAll('.customization-checkbox');
    
    customizations.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePriceSummary();
        });
    });
}

// Update price summary
function updatePriceSummary() {
    let total = basePrice;
    let addonsHtml = '';

    // Add add-ons to total
    selectedAddons.forEach(addon => {
        total += addon.price;
        addonsHtml += `
            <div class="price-line">
                <span>${addon.name}</span>
                <span>₱${addon.price.toLocaleString()}</span>
            </div>
        `;
    });

    // Insert addons line items
    const addonsLineItems = document.getElementById('addonsLineItems');
    addonsLineItems.innerHTML = addonsHtml;

    // Add transport fee to total
    const grandTotal = total + TRANSPORT_FEE;

    // Update total price
    document.getElementById('packageTotal').textContent = `₱${basePrice.toLocaleString()}`;
    document.getElementById('transportFee').textContent = `₱${TRANSPORT_FEE.toLocaleString()}`;
    document.getElementById('totalPrice').textContent = `₱${grandTotal.toLocaleString()}`;

    // Store total in session (with transport fee)
    sessionStorage.setItem('bookingTotal', grandTotal);
}

// Get selected customizations
function getCustomizations() {
    const customizations = document.querySelectorAll('.customization-checkbox:checked');
    return Array.from(customizations).map(cb => cb.value);
}

// Proceed to contact form
document.addEventListener('DOMContentLoaded', function() {
    const proceedBtn = document.getElementById('proceedToContactBtn');
    
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function() {
            const selectedDrinks = JSON.parse(sessionStorage.getItem('selectedDrinks')) || [];
            const customizations = getCustomizations();

            // Store booking data
            sessionStorage.setItem('selectedAddons', JSON.stringify(selectedAddons));
            sessionStorage.setItem('selectedCustomizations', JSON.stringify(customizations));

            // Store complete booking info for contact form
            const bookingInfo = {
                package: JSON.parse(sessionStorage.getItem('packageInfo')),
                drinks: selectedDrinks,
                addons: selectedAddons,
                customizations: customizations,
                total: sessionStorage.getItem('bookingTotal')
            };
            sessionStorage.setItem('completeBookingInfo', JSON.stringify(bookingInfo));

            // Redirect to payment page
            window.location.href = 'payment.html';
        });
    }

    // Initialize page
    initializeBooking();
});
