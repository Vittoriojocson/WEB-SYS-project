// ========== GCASH PAYMENT PROOF LOGIC ==========

let selectedFile = null;

document.addEventListener('DOMContentLoaded', function() {
    displayAmount();
    setupFileUpload();
    setupSubmitButton();
});

// Display booking total amount
function displayAmount() {
    const bookingTotal = sessionStorage.getItem('bookingTotal') || '7000';
    document.getElementById('summaryAmount').textContent = `₱${Number(bookingTotal).toLocaleString()}`;
}

// Setup file upload handling
function setupFileUpload() {
    const fileInput = document.getElementById('proofFile');
    const fileLabel = document.querySelector('.file-label');
    const removeBtn = document.getElementById('removeFileBtn');

    // File input change
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file (PNG, JPG, GIF)');
                fileInput.value = '';
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size cannot exceed 5MB');
                fileInput.value = '';
                return;
            }

            selectedFile = file;

            // Read and preview image
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('previewImage');
                preview.src = e.target.result;
                document.getElementById('previewContainer').style.display = 'block';

                // Disable file label when file is selected
                fileLabel.style.opacity = '0.5';
                fileLabel.style.pointerEvents = 'none';

                // Enable submit button
                document.getElementById('submitProofBtn').disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    // Click on label to open file dialog
    fileLabel.addEventListener('click', function(e) {
        if (!selectedFile) {
            e.preventDefault();
            fileInput.click();
        }
    });

    // Remove file button
    removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        selectedFile = null;
        fileInput.value = '';
        document.getElementById('previewContainer').style.display = 'none';
        fileLabel.style.opacity = '1';
        fileLabel.style.pointerEvents = 'auto';
        document.getElementById('submitProofBtn').disabled = true;
    });
}

// Setup submit button
function setupSubmitButton() {
    const submitBtn = document.getElementById('submitProofBtn');

    submitBtn.addEventListener('click', function() {
        if (!selectedFile) {
            alert('Please select a payment screenshot');
            return;
        }

        // Store payment proof information in sessionStorage
        const proofData = {
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            submittedAt: new Date().toISOString(),
            bookingTotal: sessionStorage.getItem('bookingTotal'),
            paymentMethod: 'GCash'
        };

        sessionStorage.setItem('gcashPaymentProof', JSON.stringify(proofData));

        // In production, you would upload the file to server here
        // For now, just proceed to confirmation page
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Simulate processing and redirect
        setTimeout(() => {
            window.location.href = 'gcash-confirmation.html';
        }, 1000);
    });
}
