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
    setupCustomerDetailsForm();
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
    
    paymentBtn.addEventListener('click', async function() {
        // Check if customer details are confirmed
        const customerDetails = JSON.parse(sessionStorage.getItem('customerDetails') || '{}');
        if (!customerDetails.name || !customerDetails.email) {
            alert('Please confirm your customer details before proceeding.');
            return;
        }

        const selectedPayment = document.querySelector('.payment-radio:checked');
        
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }

        await processPayment(selectedPayment.value);
    });
}

// Process payment
async function processPayment(paymentMethod) {
    const paymentMethodNames = {
        'card': 'Credit/Debit Card',
        'gcash': 'GCash',
        'paymaya': 'PayMaya',
        'bank': 'Bank Transfer'
    };

    // Get customer details from sessionStorage
    const customerDetails = JSON.parse(sessionStorage.getItem('customerDetails') || '{}');
    const packageInfo = JSON.parse(sessionStorage.getItem('packageInfo') || '{}');
    const selectedDrinks = JSON.parse(sessionStorage.getItem('selectedDrinks') || '[]');
    const confirmedDateTime = JSON.parse(sessionStorage.getItem('confirmedDateTime') || '{}');

    // Validate all required data is present
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.location) {
        alert('Customer information is incomplete. Please refresh and try again.');
        return;
    }

    if (!packageInfo.id || !packageInfo.name) {
        alert('Package information is missing. Please go back and select a package again.');
        window.location.href = 'drinks-packages.html';
        return;
    }

    if (!selectedDrinks || selectedDrinks.length === 0) {
        alert('No drinks selected. Please go back and select drinks.');
        window.location.href = 'drinks-selection.html';
        return;
    }

    if (!confirmedDateTime.date || !confirmedDateTime.time) {
        alert('Event date/time is missing. Please go back and confirm your event details.');
        window.location.href = 'drinks-selection.html';
        return;
    }

    // Prepare order data for backend
    const orderData = {
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        event_location: customerDetails.location,
        city: customerDetails.city || null,
        province: customerDetails.province || null,
        postal_code: null,
        package_id: packageInfo.id || packageInfo.name,
        package_name: packageInfo.name,
        package_price: packageInfo.price,
        selected_drinks: selectedDrinks,
        guest_count: null,
        event_date: confirmedDateTime.date,
        event_time: confirmedDateTime.time,
        special_requests: null
    };

    // Store payment method in sessionStorage
    sessionStorage.setItem('paymentMethod', paymentMethod);
    sessionStorage.setItem('paymentMethodName', paymentMethodNames[paymentMethod]);
    
    // Store complete order information including customer details
    const completeOrder = {
        timestamp: new Date().toISOString(),
        customer: customerDetails,
        package: bookingData.package,
        drinks: bookingData.drinks,
        addons: bookingData.addons,
        customizations: bookingData.customizations,
        total: bookingData.total,
        paymentMethod: paymentMethod,
        status: 'processing'
    };
    
    sessionStorage.setItem('completeOrder', JSON.stringify(completeOrder));

    // Show loading state
    const paymentBtn = document.getElementById('proceedPaymentBtn');
    if (paymentBtn) {
        paymentBtn.disabled = true;
        paymentBtn.textContent = 'Submitting Order...';
    }

    try {
        // Submit order to backend
        const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (result.success) {
            // Store order ID
            sessionStorage.setItem('orderId', result.data.order.id);

            // Handle GCash specially - route to QR code page
            if (paymentMethod === 'gcash') {
                window.location.href = 'gcash-qr.html';
                return;
            }

            // For other payment methods, show confirmation
            alert(`✅ Order submitted successfully!\n\nOrder ID: #${result.data.order.id}\n\nPayment Method: ${paymentMethodNames[paymentMethod]}\n\nWe will contact you at ${customerDetails.email} to confirm your booking.`);
            
            // Clear session storage
            sessionStorage.removeItem('selectedDrinks');
            sessionStorage.removeItem('packageInfo');
            sessionStorage.removeItem('confirmedDateTime');
            sessionStorage.removeItem('customerDetails');
            
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            throw new Error(result.errors?.join(', ') || 'Failed to submit order');
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        alert(`❌ Failed to submit order:\n${error.message}\n\nPlease try again or contact us directly.`);
        
        // Restore button state
        if (paymentBtn) {
            paymentBtn.disabled = false;
            paymentBtn.textContent = 'Proceed to Payment';
        }
    }
}

// Function to format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
}

// ========== CUSTOMER DETAILS FORM ==========
// Setup customer details form
function setupCustomerDetailsForm() {
    const confirmBtn = document.getElementById('confirmDetailsBtn');
    const editBtn = document.getElementById('editDetailsBtn');
    const form = document.getElementById('customerDetailsForm');
    const confirmedDisplay = document.getElementById('confirmedDetailsDisplay');
    const paymentMethodCard = document.getElementById('paymentMethodCard');

    // Check if customer details already confirmed (from sessionStorage)
    const savedCustomerDetails = sessionStorage.getItem('customerDetails');
    if (savedCustomerDetails) {
        const details = JSON.parse(savedCustomerDetails);
        populateForm(details);
        showConfirmedDetails(details);
        showPaymentMethods();
    }

    // Confirm details button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (validateCustomerForm()) {
                const customerDetails = getCustomerFormData();
                saveCustomerDetails(customerDetails);
                showConfirmedDetails(customerDetails);
                showPaymentMethods();
            }
        });
    }

    // Edit details button
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            hideConfirmedDetails();
            hidePaymentMethods();
        });
    }
}

// Validate customer form
function validateCustomerForm() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerEmail = document.getElementById('customerEmail').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const eventLocation = document.getElementById('eventLocation').value.trim();

    if (!customerName || customerName.length < 2) {
        alert('Please enter your full name (minimum 2 characters).');
        document.getElementById('customerName').focus();
        return false;
    }

    if (!customerEmail || !isValidEmail(customerEmail)) {
        alert('Please enter a valid email address.');
        document.getElementById('customerEmail').focus();
        return false;
    }

    if (!customerPhone || customerPhone.length < 10) {
        alert('Please enter a valid phone number (minimum 10 digits).');
        document.getElementById('customerPhone').focus();
        return false;
    }

    if (!eventLocation || eventLocation.length < 5) {
        alert('Please enter the event location/venue (minimum 5 characters).');
        document.getElementById('eventLocation').focus();
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Get customer form data
function getCustomerFormData() {
    return {
        name: document.getElementById('customerName').value.trim(),
        email: document.getElementById('customerEmail').value.trim(),
        phone: document.getElementById('customerPhone').value.trim(),
        location: document.getElementById('eventLocation').value.trim(),
        city: document.getElementById('city').value.trim() || '',
        province: document.getElementById('province').value.trim() || ''
    };
}

// Populate form with saved data
function populateForm(details) {
    document.getElementById('customerName').value = details.name;
    document.getElementById('customerEmail').value = details.email;
    document.getElementById('customerPhone').value = details.phone;
    document.getElementById('eventLocation').value = details.location;
    document.getElementById('city').value = details.city || '';
    document.getElementById('province').value = details.province || '';
}

// Save customer details to sessionStorage
function saveCustomerDetails(details) {
    sessionStorage.setItem('customerDetails', JSON.stringify(details));
}

// Show confirmed details display
function showConfirmedDetails(details) {
    const form = document.getElementById('customerDetailsForm');
    const confirmedDisplay = document.getElementById('confirmedDetailsDisplay');

    // Update display with customer info
    document.getElementById('displayName').textContent = details.name;
    document.getElementById('displayEmail').textContent = details.email;
    document.getElementById('displayPhone').textContent = details.phone;
    
    let locationText = details.location;
    if (details.city) locationText += `, ${details.city}`;
    if (details.province) locationText += `, ${details.province}`;
    document.getElementById('displayLocation').textContent = locationText;

    // Hide form, show confirmed display
    form.style.display = 'none';
    confirmedDisplay.style.display = 'block';
}

// Hide confirmed details display
function hideConfirmedDetails() {
    const form = document.getElementById('customerDetailsForm');
    const confirmedDisplay = document.getElementById('confirmedDetailsDisplay');

    form.style.display = 'block';
    confirmedDisplay.style.display = 'none';
}

// Show payment methods section
function showPaymentMethods() {
    const paymentMethodCard = document.getElementById('paymentMethodCard');
    if (paymentMethodCard) {
        paymentMethodCard.style.display = 'block';
        paymentMethodCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Hide payment methods section
function hidePaymentMethods() {
    const paymentMethodCard = document.getElementById('paymentMethodCard');
    if (paymentMethodCard) {
        paymentMethodCard.style.display = 'none';
    }
}
