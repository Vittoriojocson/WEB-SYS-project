// ========== PAYMENT PAGE LOGIC ==========

// Constants
const TRANSPORT_FEE = 2000;

// Data loaded from sessionStorage
let bookingData = {
    package: {},
    drinks: [],
    addons: [],
    customizations: [],
    total: 0
};

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    setupPaymentMethods();
    setupPaymentButton();
});

// Load order summary from sessionStorage
function loadOrderSummary() {
    try {
        // Get data from sessionStorage
        const packageInfo = JSON.parse(sessionStorage.getItem('packageInfo') || '{}');
        const selectedDrinks = JSON.parse(sessionStorage.getItem('selectedDrinks') || '[]');
        const selectedAddons = JSON.parse(sessionStorage.getItem('selectedAddons') || '[]');
        const selectedCustomizations = JSON.parse(sessionStorage.getItem('selectedCustomizations') || '[]');
        const bookingTotal = sessionStorage.getItem('bookingTotal') || '7000';

        bookingData.package = packageInfo;
        bookingData.drinks = selectedDrinks;
        bookingData.addons = selectedAddons;
        bookingData.customizations = selectedCustomizations;
        bookingData.total = Number(bookingTotal);

        // Display package info
        const packageDisplay = `${packageInfo.tier || 'Unknown'} - ${packageInfo.name || 'Unknown Package'}`;
        document.getElementById('summaryPackage').textContent = packageDisplay;

        // Extract and display base price from package price string
        const basePrice = extractPrice(packageInfo.price);
        document.getElementById('summaryPackagePrice').textContent = `₱${basePrice.toLocaleString()}`;

        // Display selected drinks
        displaySelectedDrinks(selectedDrinks);

        // Display add-ons
        displaySelectedAddons(selectedAddons);

        // Display customizations
        displaySelectedCustomizations(selectedCustomizations);

        // Calculate and display total (base + add-ons + transport fee)
        const addonsTotal = selectedAddons.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
        const grandTotal = basePrice + addonsTotal + TRANSPORT_FEE;
        bookingData.total = grandTotal;
        document.getElementById('summaryTotal').textContent = `₱${grandTotal.toLocaleString()}`;

    } catch (error) {
        console.error('Error loading order summary:', error);
        // Set defaults if error occurs
        document.getElementById('summaryPackage').textContent = 'Basic - Small Event';
        document.getElementById('summaryPackagePrice').textContent = '₱7,000';
        document.getElementById('summaryTotal').textContent = '₱7,000';
    }
}

// Display selected drinks
function displaySelectedDrinks(drinks) {
    const drinksContainer = document.getElementById('summaryDrinks');
    
    if (!drinks || drinks.length === 0) {
        drinksContainer.innerHTML = '<li class="no-addons">No drinks selected</li>';
        return;
    }

    drinksContainer.innerHTML = drinks
        .map(drink => `<li>• ${drink}</li>`)
        .join('');
}

// Display selected add-ons
function displaySelectedAddons(addons) {
    const addonsContainer = document.getElementById('summaryAddons');
    
    if (!addons || addons.length === 0) {
        addonsContainer.innerHTML = '<li class="no-addons">No add-ons selected</li>';
        return;
    }

    addonsContainer.innerHTML = addons
        .map(addon => `<li>• ${addon.name} - ₱${addon.price.toLocaleString()}</li>`)
        .join('');
}

// Display selected customizations
function displaySelectedCustomizations(customizations) {
    const customContainer = document.getElementById('summaryCustomizations');
    
    if (!customizations || customizations.length === 0) {
        customContainer.innerHTML = '<li class="no-addons">No customizations selected</li>';
        return;
    }

    const customizationLabels = {
        'hours': 'Extra Service Hours',
        'extra-hours': 'Extra Service Hours',
        'extra-setup': 'Additional Bar Setup',
        'extra-bartender': 'Additional Bartender',
        'premium-decor': 'Premium Bar Décor'
    };

    customContainer.innerHTML = customizations
        .map(custom => `<li>• ${customizationLabels[custom] || custom}</li>`)
        .join('');
}

// Extract price from package price string (e.g., "₱6,500 - 8,500" -> 6500)
function extractPrice(priceString) {
    if (!priceString) return 7000;

    const match = priceString.match(/₱\s*([\d,]+)/);
    if (match && match[1]) {
        return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return 7000;
}

// Setup payment method selection
function setupPaymentMethods() {
    const paymentRadios = document.querySelectorAll('.payment-radio');
    const paymentLabels = document.querySelectorAll('.payment-label');

    paymentLabels.forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault();
            const radio = this.previousElementSibling;
            radio.checked = true;
            
            // Update visual state
            updatePaymentMethodVisuals(radio.value);
        });
    });

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updatePaymentMethodVisuals(this.value);
        });
    });
}

// Update visual state of selected payment method
function updatePaymentMethodVisuals(selectedMethod) {
    const options = document.querySelectorAll('.payment-method-option');
    
    options.forEach(option => {
        const radio = option.querySelector('.payment-radio');
        if (radio.value === selectedMethod) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Setup payment button
function setupPaymentButton() {
    const paymentBtn = document.getElementById('proceedPaymentBtn');
    
    paymentBtn.addEventListener('click', function() {
        const selectedPayment = document.querySelector('.payment-radio:checked');
        
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }

        processPayment(selectedPayment.value);
    });
}

// Process payment
function processPayment(paymentMethod) {
    const paymentMethodNames = {
        'card': 'Credit/Debit Card',
        'gcash': 'GCash',
        'paymaya': 'PayMaya',
        'bank': 'Bank Transfer'
    };

    // Store payment method in sessionStorage
    sessionStorage.setItem('paymentMethod', paymentMethod);
    sessionStorage.setItem('paymentMethodName', paymentMethodNames[paymentMethod]);
    
    // Store complete order information
    const completeOrder = {
        timestamp: new Date().toISOString(),
        package: bookingData.package,
        drinks: bookingData.drinks,
        addons: bookingData.addons,
        customizations: bookingData.customizations,
        total: bookingData.total,
        paymentMethod: paymentMethod,
        status: 'processing'
    };
    
    sessionStorage.setItem('completeOrder', JSON.stringify(completeOrder));

    // Handle GCash specially - route to QR code page
    if (paymentMethod === 'gcash') {
        window.location.href = 'gcash-qr.html';
        return;
    }

    // For other payment methods, show confirmation
    const confirmMessage = `Processing payment via ${paymentMethodNames[paymentMethod]}...\n\nTotal Amount: ₱${Number(bookingData.total).toLocaleString()}\n\nYou will be redirected to complete your payment.`;
    
    if (confirm(confirmMessage)) {
        // In production, redirect to actual payment gateway
        // For now, redirect to contact form with order data
        setTimeout(() => {
            window.location.href = 'index.html#contact';
        }, 500);
    }
}

// Function to format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}
