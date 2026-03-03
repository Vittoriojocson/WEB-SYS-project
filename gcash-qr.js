// ========== GCASH QR PAGE LOGIC ==========

let timerInterval = null;
let timeRemaining = 300; // 5 minutes in seconds

document.addEventListener('DOMContentLoaded', function() {
    displayAmount();
    startTimer();
    setupContinueButton();
});

// Display booking total amount on QR page
function displayAmount() {
    const bookingTotal = sessionStorage.getItem('bookingTotal') || '7000';
    document.getElementById('qrAmount').textContent = `₱${Number(bookingTotal).toLocaleString()}`;
}

// Start countdown timer
function startTimer() {
    timerInterval = setInterval(function() {
        timeRemaining--;

        // Format timer display as MM:SS
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = timerText;

        // When timer reaches 0
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById('timerDisplay').textContent = '00:00';
            document.getElementById('timerDisplay').style.color = '#ff4444';
            document.querySelector('.timer-subtitle').textContent = 'Timer expired, but you can still continue';
        }
    }, 1000);
}

// Setup continue button
function setupContinueButton() {
    const continueBtn = document.getElementById('continueBtn');

    continueBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        // Redirect to payment proof page
        window.location.href = 'gcash-payment-proof.html';
    });
}
