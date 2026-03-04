// ==================== DRINKS SELECTION PAGE ====================
/**
 * Handles the drinks selection page functionality
 * - Retrieves selected package from URL parameters
 * - Displays package details
 * - Manages drink selection with checkboxes
 * - Updates selected drinks list in real-time
 * - Proceeds to booking with selected drinks info
 */

// Package information database
const packageDatabase = {
    'unlimited-4hr': {
        name: '4hrs Unlimited Drink',
        tier: 'Premium',
        price: '₱7,000 - ₱14,500',
        description: 'Cocktails, Shooters & Mocktails (30-500 Pax)',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-30': {
        name: '4hrs Unlimited Drink - 30 Pax',
        tier: 'Premium',
        price: '₱7,000',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-40': {
        name: '4hrs Unlimited Drink - 40 Pax',
        tier: 'Premium',
        price: '₱7,500',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-50': {
        name: '4hrs Unlimited Drink - 50 Pax',
        tier: 'Premium',
        price: '₱8,000',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-60': {
        name: '4hrs Unlimited Drink - 60 Pax',
        tier: 'Premium',
        price: '₱8,500',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-70': {
        name: '4hrs Unlimited Drink - 70 Pax',
        tier: 'Premium',
        price: '₱9,000',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-80': {
        name: '4hrs Unlimited Drink - 80 Pax',
        tier: 'Premium',
        price: '₱9,500',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-90': {
        name: '4hrs Unlimited Drink - 90 Pax',
        tier: 'Premium',
        price: '₱10,000',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-100': {
        name: '4hrs Unlimited Drink - 100 Pax',
        tier: 'Premium',
        price: '₱10,500',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-150': {
        name: '4hrs Unlimited Drink - 150 Pax',
        tier: 'Premium',
        price: '₱11,000',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-200': {
        name: '4hrs Unlimited Drink - 200 Pax',
        tier: 'Premium',
        price: '₱11,500',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-250': {
        name: '4hrs Unlimited Drink - 250 Pax',
        tier: 'Premium',
        price: '₱12,000',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-300': {
        name: '4hrs Unlimited Drink - 300 Pax',
        tier: 'Premium',
        price: '₱12,500',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-350': {
        name: '4hrs Unlimited Drink - 350 Pax',
        tier: 'Premium',
        price: '₱13,000',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-400': {
        name: '4hrs Unlimited Drink - 400 Pax',
        tier: 'Premium',
        price: '₱13,500',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-450': {
        name: '4hrs Unlimited Drink - 450 Pax',
        tier: 'Premium',
        price: '₱14,000',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'unlimited-4hr-500': {
        name: '4hrs Unlimited Drink - 500 Pax',
        tier: 'Premium',
        price: '₱14,500',
        description: 'Cocktails, Shooters & Mocktails',
        features: '4-6 Cocktails and Shooters, 1-2 Mocktails, Freebies Included'
    },
    'consumable-100': {
        name: '3hrs Service - 100 Drinks',
        tier: 'Basic',
        price: '₱6,000',
        description: 'Consumable Drink Package (100 Drinks Total)',
        features: '3 Hours Service, Choice of 3 Cocktails, 2 Shooters, 1 Mocktail'
    },
    'consumable-150': {
        name: '3hrs Service - 150 Drinks',
        tier: 'Basic',
        price: '₱7,000',
        description: 'Consumable Drink Package (150 Drinks Total)',
        features: '3 Hours Service, Choice of 3 Cocktails, 2 Shooters, 1 Mocktail'
    },
    'consumable-200': {
        name: '3hrs Service - 200 Drinks',
        tier: 'Basic',
        price: '₱8,000',
        description: 'Consumable Drink Package (200 Drinks Total)',
        features: '3 Hours Service, Choice of 3 Cocktails, 2 Shooters, 1 Mocktail'
    },
    'consumable-300': {
        name: '3hrs Service - 300 Drinks',
        tier: 'Basic',
        price: '₱10,000',
        description: 'Consumable Drink Package (300 Drinks Total)',
        features: '3 Hours Service, Choice of 3 Cocktails, 2 Shooters, 1 Mocktail'
    },
    'small-basic': {
        name: 'Small Event',
        tier: 'Basic',
        price: '₱6,500 - 8,500',
        description: 'Perfect for intimate gatherings (50-100 Pax)',
        features: '3 Hours Service, 1 Bar Setup, 1-2 Bartenders'
    },
    'medium-basic': {
        name: 'Medium Event',
        tier: 'Basic',
        price: '₱9,000 - 12,000',
        description: 'Great for mid-sized events (100-300 Pax)',
        features: '4 Hours Service, 2 Bar Setups, 2-3 Bartenders'
    },
    'large-basic': {
        name: 'Large Event',
        tier: 'Basic',
        price: '₱15,000 - 25,000',
        description: 'Perfect for large celebrations (300-500 Pax)',
        features: '4-5 Hours Service, 3-4 Bar Setups, 3-4 Bartenders'
    },
    'addons-premium': {
        name: 'Premium Add-on Bars',
        tier: 'Premium',
        price: '₱3,000 - 8,000',
        description: 'Supplementary bar service',
        features: '1 Additional Bar Setup, 1 Professional Bartender'
    },
    'custom-full': {
        name: 'Fully Customizable',
        tier: 'Custom',
        price: 'POI (Price on Inquiry)',
        description: 'Design your perfect bar experience (Any Size)',
        features: 'Custom Duration & Hours, Your Choice of Bar Setup'
    },
    'custom-premium': {
        name: 'Premium Customizable',
        tier: 'Custom',
        price: '₱35,000+',
        description: 'Premium custom experience (500+ Pax)',
        features: 'Extended Service Hours, Multiple Premium Bar Setups'
    },
    'custom-corporate': {
        name: 'Corporate & Group Events',
        tier: 'Custom',
        price: 'Special Rates',
        description: 'Perfect for corporate and group events (100+ Pax)',
        features: 'Volume Discounts Available, Multi-Location Support'
    }
};

// Get URL parameters
function getURLParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Initialize page with package info
function initializePage() {
    const packageId = getURLParameter('package') || 'small-basic';
    const packageInfo = packageDatabase[packageId];

    if (packageInfo) {
        // Update package summary
        document.getElementById('packageName').textContent = `${packageInfo.tier} - ${packageInfo.name}`;
        document.getElementById('packagePrice').textContent = packageInfo.price;
        document.getElementById('packageDesc').textContent = packageInfo.description;
        
        // Store package ID for booking
        sessionStorage.setItem('selectedPackage', packageId);
        // Include the package ID in the packageInfo object
        const packageInfoWithId = { ...packageInfo, id: packageId };
        sessionStorage.setItem('packageInfo', JSON.stringify(packageInfoWithId));
        sessionStorage.setItem('selectedPackageId', packageId);
    }

    // Setup drink selection listeners
    setupDrinkCheckboxes();
    
    // Display selection limits if applicable
    displaySelectionLimits();
}

// Get drink selection limits for the current package
function getDrinkSelectionLimits() {
    const packageId = sessionStorage.getItem('selectedPackageId');
    
    // Consumable packages have limits
    const consumablePackages = ['consumable-100', 'consumable-150', 'consumable-200', 'consumable-300'];
    
    if (consumablePackages.includes(packageId)) {
        return {
            cocktails: 3,
            shots: 2,
            mocktails: 1
        };
    }
    
    // Premium unlimited packages have limits
    const premiumPackages = ['unlimited-4hr', 'unlimited-4hr-30', 'unlimited-4hr-40', 'unlimited-4hr-50', 
                             'unlimited-4hr-60', 'unlimited-4hr-70', 'unlimited-4hr-80', 'unlimited-4hr-90',
                             'unlimited-4hr-100', 'unlimited-4hr-150', 'unlimited-4hr-200', 'unlimited-4hr-250',
                             'unlimited-4hr-300', 'unlimited-4hr-350', 'unlimited-4hr-400', 'unlimited-4hr-450',
                             'unlimited-4hr-500'];
    
    if (premiumPackages.includes(packageId)) {
        return {
            cocktails: 6,
            shots: 6,
            mocktails: 2
        };
    }
    
    // Other packages have no limits
    return null;
}

// Display selection limits message if applicable
function displaySelectionLimits() {
    const limits = getDrinkSelectionLimits();
    const limitsInfoDiv = document.getElementById('selectionLimitsInfo');
    
    if (!limits) {
        limitsInfoDiv.style.display = 'none';
        return;
    }
    
    const packageId = sessionStorage.getItem('selectedPackageId');
    const premiumPackages = ['unlimited-4hr', 'unlimited-4hr-30', 'unlimited-4hr-40', 'unlimited-4hr-50', 
                             'unlimited-4hr-60', 'unlimited-4hr-70', 'unlimited-4hr-80', 'unlimited-4hr-90',
                             'unlimited-4hr-100', 'unlimited-4hr-150', 'unlimited-4hr-200', 'unlimited-4hr-250',
                             'unlimited-4hr-300', 'unlimited-4hr-350', 'unlimited-4hr-400', 'unlimited-4hr-450',
                             'unlimited-4hr-500'];
    
    const limitsText = document.getElementById('limitsText');
    
    if (premiumPackages.includes(packageId)) {
        limitsText.textContent = `Max 6 Cocktails, 6 Shooters, 2 Mocktails`;
    } else {
        limitsText.textContent = `Max 3 Cocktails, 2 Shooters, 1 Mocktail`;
    }
    
    limitsInfoDiv.style.display = 'block';
}

// Check if selection limit is reached and validate
function validateDrinkSelection(checkbox) {
    const limits = getDrinkSelectionLimits();
    
    // If no limits, allow selection
    if (!limits) return true;

    const category = checkbox.getAttribute('data-category');
    const checkedInCategory = document.querySelectorAll(`.drink-checkbox[data-category="${category}"]:checked`).length;
    const limitForCategory = limits[category];

    // If unchecking, always allow
    if (!checkbox.checked) return true;

    // If already at limit and trying to check, prevent it
    if (checkedInCategory > limitForCategory) {
        checkbox.checked = false;
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        alert(`You can only select ${limitForCategory} ${categoryName}. Maximum reached.`);
        return false;
    }

    return true;
}

// Setup drink checkbox listeners
function setupDrinkCheckboxes() {
    const checkboxes = document.querySelectorAll('.drink-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(e) {
            validateDrinkSelection(this);
            updateSelectedDrinksList();
        });
    });
}

// Update the selected drinks list display
function updateSelectedDrinksList() {
    const checkboxes = document.querySelectorAll('.drink-checkbox:checked');
    const selectedDrinksList = document.getElementById('selectedDrinksList');
    
    if (checkboxes.length === 0) {
        selectedDrinksList.innerHTML = '<p class="empty-selection">No drinks selected yet</p>';
        return;
    }

    let html = '<ul class="drinks-list-items">';
    const selectedDrinks = [];

    checkboxes.forEach(checkbox => {
        const drinkName = checkbox.value;
        const category = checkbox.getAttribute('data-category');
        selectedDrinks.push(drinkName);
        html += `<li>${drinkName}</li>`;
    });

    html += '</ul>';
    selectedDrinksList.innerHTML = html;

    // Store selected drinks in session storage
    sessionStorage.setItem('selectedDrinks', JSON.stringify(selectedDrinks));
}

// ==================== DATE & TIME SELECTION ====================
/**
 * Handles date and time selection before drinks selection
 * - Sets minimum date to today
 * - Validates date/time input
 * - Stores confirmed date/time in sessionStorage
 * - Shows/hides drinks selection based on confirmation
 */

// Initialize date/time selection
function initializeDateTimeSelection() {
    const dateInput = document.getElementById('eventDateSelect');
    const timeInput = document.getElementById('eventTimeSelect');
    const confirmBtn = document.getElementById('confirmDateTime');
    const changeDateTimeBtn = document.getElementById('changeDateTimeBtn');
    const selectedDisplay = document.getElementById('selectedDateTimeDisplay');
    const displayDateTime = document.getElementById('displayDateTime');
    const drinksSection = document.querySelector('.drinks-selection-form');
    const dateTimeCard = document.querySelector('.date-time-selection-card');

    // Set minimum date to today
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
    dateInput.value = minDate; // Set default to today

    // Check if date/time already confirmed (from sessionStorage)
    const savedDateTime = sessionStorage.getItem('confirmedDateTime');
    if (savedDateTime) {
        const { date, time } = JSON.parse(savedDateTime);
        dateInput.value = date;
        timeInput.value = time;
        showConfirmedDateTime(date, time);
        if (drinksSection) drinksSection.style.display = 'block';
    } else {
        // Hide drinks section until date/time confirmed
        if (drinksSection) drinksSection.style.display = 'none';
    }

    // Enable/disable confirm button based on inputs
    function updateConfirmButton() {
        if (dateInput.value && timeInput.value) {
            confirmBtn.disabled = false;
        } else {
            confirmBtn.disabled = true;
        }
    }

    // Listen for input changes
    dateInput.addEventListener('change', updateConfirmButton);
    timeInput.addEventListener('change', updateConfirmButton);

    // Initial check
    updateConfirmButton();

    // Confirm date/time button
    confirmBtn.addEventListener('click', function() {
        const selectedDate = dateInput.value;
        const selectedTime = timeInput.value;

        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time for your event.');
            return;
        }

        // Save to sessionStorage
        sessionStorage.setItem('confirmedDateTime', JSON.stringify({
            date: selectedDate,
            time: selectedTime
        }));

        // Show confirmation
        showConfirmedDateTime(selectedDate, selectedTime);

        // Show drinks section
        if (drinksSection) {
            drinksSection.style.display = 'block';
            drinksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Change date/time button
    if (changeDateTimeBtn) {
        changeDateTimeBtn.addEventListener('click', function() {
            // Hide confirmation, show inputs
            selectedDisplay.style.display = 'none';
            confirmBtn.style.display = 'inline-block';
            dateInput.disabled = false;
            timeInput.disabled = false;
            dateTimeCard.classList.remove('confirmed');

            // Optionally hide drinks section again
            // if (drinksSection) drinksSection.style.display = 'none';
        });
    }

    function showConfirmedDateTime(date, time) {
        // Format the date nicely
        const dateObj = new Date(date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        // Format time to 12-hour format
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const formattedTime = `${displayHour}:${minutes} ${ampm}`;

        // Update display
        displayDateTime.textContent = `${formattedDate} at ${formattedTime}`;
        selectedDisplay.style.display = 'flex';
        confirmBtn.style.display = 'none';

        // Disable inputs
        dateInput.disabled = true;
        timeInput.disabled = true;

        // Add confirmed styling
        dateTimeCard.classList.add('confirmed');
    }
}

// Handle proceed to booking button
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date/time selection
    initializeDateTimeSelection();
    const proceedBtn = document.getElementById('proceedBtn');
    
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function() {
            const checkboxes = document.querySelectorAll('.drink-checkbox:checked');
            
            if (checkboxes.length === 0) {
                alert('Please select at least one drink before proceeding.');
                return;
            }

            // Get confirmed date/time from sessionStorage (required)
            const confirmedDateTime = sessionStorage.getItem('confirmedDateTime');
            if (!confirmedDateTime) {
                alert('Please confirm your event date and time before proceeding.');
                document.getElementById('dateTimeSelection').scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // Collect selected drinks
            const selectedDrinks = Array.from(checkboxes).map(cb => cb.value);
            const packageInfo = JSON.parse(sessionStorage.getItem('packageInfo'));

            if (!packageInfo) {
                alert('Package information is missing. Please select a package again.');
                window.location.href = 'drinks-packages.html';
                return;
            }

            // Store selected drinks and date/time in sessionStorage
            sessionStorage.setItem('selectedDrinks', JSON.stringify(selectedDrinks));
            sessionStorage.setItem('confirmedDateTime', confirmedDateTime);

            // Redirect to payment page
            window.location.href = 'payment.html';
        });
    }

    // Initialize page
    initializePage();
});

// Email validation helper (kept for potential future use)
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
