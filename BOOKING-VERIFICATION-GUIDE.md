# Booking Verification & Payment Proof System

## Overview
The JiggerOnTheMix backend now supports payment proof uploads and automated email verification when bookings are approved by admins.

---

## 🔄 Database Updates

### New Columns in `bookings` Table:
- **`payment_proof`** (TEXT) - Base64 encoded image or file path to payment screenshot
- **`payment_method`** (TEXT) - Payment method used (e.g., "GCash", "Bank Transfer", "PayPal")
- **`customer_email`** (TEXT) - Customer's email address for verification
- **`customer_name`** (TEXT) - Customer's full name
- **`approved_at`** (DATETIME) - Timestamp when booking was approved
- **`verification_sent`** (INTEGER) - Boolean flag (0/1) indicating if verification email was sent

### Migration
The database automatically migrates existing tables when the server starts. No manual migration needed.

---

## 📤 API Endpoints

### 1. Create Booking with Payment Proof
**Endpoint:** `POST /api/booking/create`

**Request Body:**
```json
{
  "contact_id": 123,
  "package_type": "professional",
  "event_date": "2026-06-15",
  "guest_count": 100,
  "payment_proof": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "payment_method": "GCash",
  "customer_email": "customer@example.com",
  "customer_name": "Juan Dela Cruz"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully. Awaiting admin approval.",
  "data": {
    "booking": {
      "id": 45,
      "status": "pending",
      "verification_sent": 0,
      ...
    }
  }
}
```

**Notes:**
- `contact_id` is now optional (can be `null`)
- `customer_email` and `customer_name` are **required**
- `payment_proof` accepts Base64 encoded images or file URLs
- Booking status defaults to `"pending"`

---

### 2. Approve Booking & Send Verification
**Endpoint:** `POST /api/admin/approve-booking/:id`

**Example:** `POST /api/admin/approve-booking/45`

**Response:**
```json
{
  "success": true,
  "message": "Booking approved and verification email sent successfully",
  "data": {
    "booking": {
      "id": 45,
      "status": "approved",
      "approved_at": "2026-03-04T10:30:00.000Z",
      "verification_sent": 1,
      ...
    },
    "email_sent": true
  }
}
```

**What Happens:**
1. Updates booking status to `"approved"`
2. Sets `approved_at` timestamp
3. Sends professional verification email to customer
4. Sets `verification_sent` to `1`
5. Logs email in `email_logs` table

**Email includes:**
- Booking confirmation number
- Package details
- Event date and guest count
- Total amount paid
- Payment method
- Next steps for event preparation

---

## 🎨 Admin Panel Updates

### Enhanced Bookings Table
The admin panel now displays:
- **Customer Name & Email** - Full contact information
- **Payment Method** - How customer paid (GCash, Bank, etc.)
- **Payment Proof** - "📷 View" button to see uploaded proof image
- **Actions Column** - "✓ Approve" button for pending bookings

### Features:
1. **View Payment Proof** - Click "📷 View" to open full-screen modal with payment screenshot
2. **Approve Booking** - Click "✓ Approve" to:
   - Approve the booking
   - Send verification email automatically
   - Update booking status
3. **Real-time Updates** - Table refreshes after approval

### Modal Dialog
- Click outside modal to close
- Click "×" button to close
- Displays full-size payment proof image
- Responsive design for mobile/tablet

---

## 📧 Email Templates

### Verification Email Includes:
- ✅ Booking approved banner
- 📋 Complete booking details table
- 📅 Formatted event date
- 💰 Price breakdown
- 📝 What happens next (step-by-step)
- ⚠️ Important reminders (cancellation policy, etc.)
- 📞 Contact information
- 🔗 Website link

### Professional Design:
- Responsive HTML email
- Brand colors (red accent #dd0000)
- Clean typography
- Mobile-optimized layout

---

## 🔒 Security & Validation

### Backend Validation:
- Validates customer email format
- Checks booking exists before approval
- Prevents double-approval
- Requires customer info for approval
- Logs all email attempts (success/failure)

### Error Handling:
- Graceful failure if email doesn't send (booking still approved)
- Detailed error messages logged to database
- Admin notified if email failed

---

## 💡 Usage Example

### Frontend Implementation (example):

```javascript
// Customer uploads payment proof and submits booking
async function submitBookingWithProof() {
  const paymentProofFile = document.getElementById('paymentProofInput').files[0];
  
  // Convert to Base64
  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Image = e.target.result;
    
    const bookingData = {
      package_type: "professional",
      event_date: "2026-06-15",
      guest_count: 100,
      payment_proof: base64Image,
      payment_method: "GCash",
      customer_email: "customer@example.com",
      customer_name: "Juan Dela Cruz"
    };
    
    const response = await fetch('http://localhost:5000/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    if (result.success) {
      alert('Booking submitted! Wait for admin approval.');
    }
  };
  
  reader.readAsDataURL(paymentProofFile);
}
```

### Admin Approval:
1. Open Admin Panel (`admin.html`)
2. Click "📅 Bookings" tab
3. View payment proof by clicking "📷 View"
4. Verify payment is legitimate
5. Click "✓ Approve" button
6. Customer automatically receives verification email

---

## 📊 Database Schema

```sql
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER,
    package_type TEXT NOT NULL,
    event_date DATETIME,
    guest_count INTEGER,
    price_quote REAL,
    status TEXT DEFAULT 'pending',
    payment_proof TEXT,              -- NEW
    payment_method TEXT,              -- NEW
    customer_email TEXT,              -- NEW
    customer_name TEXT,               -- NEW
    approved_at DATETIME,             -- NEW
    verification_sent INTEGER DEFAULT 0,  -- NEW
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contact_messages(id)
);
```

---

## 🚀 Deployment Notes

### Environment Variables Required:
Ensure your `.env` file has email configuration:

```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_SENDER="JiggerOnTheMix <noreply@jiggeronthemix.com>"
```

### Gmail Setup:
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use App Password (not regular password) in `MAIL_PASSWORD`

---

## 📝 Testing Checklist

- [ ] Create booking with payment proof
- [ ] View payment proof in admin panel
- [ ] Approve booking via admin panel
- [ ] Verify email received by customer
- [ ] Check email contains correct booking details
- [ ] Verify booking status updated to "approved"
- [ ] Check `email_logs` table for sent email
- [ ] Test with invalid email address
- [ ] Test approval of already-approved booking
- [ ] Test with missing customer information

---

## 🛠️ Troubleshooting

### Email Not Sending?
1. Check `.env` configuration
2. Verify Gmail App Password is correct
3. Check `email_logs` table for error messages
4. Ensure SMTP port 587 is not blocked by firewall

### Payment Proof Not Displaying?
1. Ensure Base64 string includes `data:image/png;base64,` prefix
2. Check browser console for image loading errors
3. Verify image size is reasonable (< 5MB recommended)

### Booking Approval Failed?
1. Check customer_email and customer_name are provided
2. Verify booking exists and status is "pending"
3. Check backend logs for detailed error messages

---

## 📚 Related Files

- **Backend:**
  - `backend/database.js` - Database schema and migrations
  - `backend/utils.js` - Email service and templates
  - `backend/routes/booking.js` - Booking creation endpoint
  - `backend/routes/admin.js` - Approval endpoint

- **Frontend:**
  - `admin.html` - Admin dashboard with approval UI

---

## 🎉 Features Summary

✅ Upload payment proof screenshots  
✅ Store customer contact information  
✅ View payment proofs in admin panel  
✅ One-click booking approval  
✅ Automated verification emails  
✅ Professional email templates  
✅ Email delivery logging  
✅ Real-time admin panel updates  
✅ Mobile-responsive admin UI  
✅ Secure payment proof storage  

---

**Last Updated:** March 4, 2026  
**Version:** 1.0.0  
**Author:** JiggerOnTheMix Development Team
