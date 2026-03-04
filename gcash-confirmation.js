// ========== GCASH CONFIRMATION PAGE LOGIC ==========

let confirmationTime = 600; // 10 minutes in seconds

document.addEventListener('DOMContentLoaded', function() {
    displayAmount();
    displaySubmittedTime();
    startConfirmationTimer();
    storeBookingConfirmation();
});

// Display booking total amount
function displayAmount() {
    const bookingTotal = sessionStorage.getItem('bookingTotal') || '7000';
    const totalAmount = Number(bookingTotal);
    document.getElementById('detailAmount').textContent = `₱${totalAmount.toLocaleString()}`;
}

// Display submitted time
function displaySubmittedTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
    document.getElementById('submittedTime').textContent = `${now.toLocaleDateString()} at ${timeString}`;
}

// Start 10-minute confirmation countdown timer
function startConfirmationTimer() {
    const timerDisplay = document.getElementById('confirmationTimer');
    
    const timerInterval = setInterval(function() {
        confirmationTime--;

        // Format timer as MM:SS
        const minutes = Math.floor(confirmationTime / 60);
        const seconds = confirmationTime % 60;
        const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerDisplay.textContent = timerText;

        // Change color as time runs out
        if (confirmationTime <= 60) {
            timerDisplay.style.color = '#ff6666';
        }

        // When timer reaches 0
        if (confirmationTime <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '00:00';
            timerDisplay.style.color = '#22a822';
            document.querySelector('.timer-info').textContent = 'Should have been received';
        }
    }, 1000);
}

// Store booking confirmation in sessionStorage
function storeBookingConfirmation() {
    const confirmationData = {
        confirmationTime: new Date().toISOString(),
        paymentMethod: 'GCash',
        amount: sessionStorage.getItem('bookingTotal'),
        status: 'pending_verification',
        gcashProof: sessionStorage.getItem('gcashPaymentProof'),
        completeOrder: sessionStorage.getItem('completeOrder')
    };

    sessionStorage.setItem('bookingConfirmation', JSON.stringify(confirmationData));

    // Also create a reference number
    const referenceNumber = generateReferenceNumber();
    sessionStorage.setItem('bookingReferenceNumber', referenceNumber);
}

// Generate a booking reference number
function generateReferenceNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BK-${random}-${timestamp}`;
}
