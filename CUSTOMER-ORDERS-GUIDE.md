# Customer Orders System with Drink Selection

## Overview
The JiggerOnTheMix website now includes a complete customer order management system. Customers can select their drinks, provide their complete information including location details, and submit orders directly from the drinks selection page.

---

## 🎯 Features

### Customer-Facing Features:
- **Drink Selection** - Choose from cocktails, shooters, and mocktails
- **Customer Information Form** - Capture complete customer details
- **Location Tracking** - Full address with city, province, and postal code
- **Event Planning** - Optional guest count and event date
- **Special Requests** - Text area for additional notes or requirements
- **Direct Order Submission** - Submit orders without going through booking page

### Admin Features:
- **Orders Dashboard** - View all customer orders in organized table
- **Customer Details** - See complete contact information and location
- **Drink Selection Viewer** - Modal popup to view selected drinks
- **Status Management** - Update order status (pending → confirmed → processing → completed)
- **Statistics** - Track total and pending orders in dashboard
- **Filtering** - Filter orders by status

---

## 🗄️ Database Schema

### New Table: `customer_orders`

```sql
CREATE TABLE customer_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    event_location TEXT NOT NULL,
    city TEXT,
    province TEXT,
    postal_code TEXT,
    package_id TEXT NOT NULL,
    package_name TEXT NOT NULL,
    package_price TEXT,
    selected_drinks TEXT NOT NULL,  -- JSON array of drink names
    guest_count INTEGER,
    event_date DATETIME,
    special_requests TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
```

**Fields:**
- **customer_name** - Full name (required, min 2 chars)
- **customer_email** - Valid email address (required)
- **customer_phone** - Contact number (optional)
- **event_location** - Venue or full address (required, min 5 chars)
- **city** - City/Municipality (optional)
- **province** - Province/Region (optional)
- **postal_code** - Postal/ZIP code (optional)
- **package_id** - Package identifier from session
- **package_name** - Human-readable package name
- **package_price** - Package price range
- **selected_drinks** - JSON array of selected drink names
- **guest_count** - Expected number of guests (optional)
- **event_date** - Scheduled event date (optional)
- **special_requests** - Additional notes or requirements (optional)
- **status** - Order status (pending/confirmed/processing/completed/cancelled)
- **notes** - Admin notes (optional)

---

## 📡 API Endpoints

### 1. Create Customer Order
**Endpoint:** `POST /api/orders/create`

**Request Body:**
```json
{
  "customer_name": "Juan Dela Cruz",
  "customer_email": "juan@example.com",
  "customer_phone": "+63 912 345 6789",
  "event_location": "Grand Ballroom, Manila Hotel",
  "city": "Manila",
  "province": "Metro Manila",
  "postal_code": "1000",
  "package_id": "unlimited-4hr-100",
  "package_name": "4hrs Unlimited Drink - 100 Pax",
  "package_price": "₱10,500",
  "selected_drinks": ["Frozen Margarita", "Tequila Sunrise", "Mojito"],
  "guest_count": 100,
  "event_date": "2026-06-15",
  "special_requests": "Please provide extra ice buckets"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully. We will contact you soon!",
  "data": {
    "order": {
      "id": 1,
      "customer_name": "Juan Dela Cruz",
      "customer_email": "juan@example.com",
      "status": "pending",
      "created_at": "2026-03-04T10:30:00.000Z",
      ...
    }
  }
}
```

**Validation:**
- Customer name must be at least 2 characters
- Email must be valid format
- Event location must be at least 5 characters
- At least one drink must be selected
- Package information is required

---

### 2. Get All Orders
**Endpoint:** `GET /api/orders/list?status=pending&limit=50`

**Query Parameters:**
- `status` (optional) - Filter by status
- `limit` (optional) - Maximum results (default: 50)

**Response:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "count": 25,
    "orders": [
      {
        "id": 1,
        "customer_name": "Juan Dela Cruz",
        "selected_drinks": ["Frozen Margarita", "Tequila Sunrise"],
        ...
      }
    ]
  }
}
```

---

### 3. Get Single Order
**Endpoint:** `GET /api/orders/:id`

**Response:**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "order": {
      "id": 1,
      "customer_name": "Juan Dela Cruz",
      "selected_drinks": ["Frozen Margarita", "Tequila Sunrise"],
      ...
    }
  }
}
```

---

### 4. Update Order Status
**Endpoint:** `PUT /api/orders/:id/status`

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Customer confirmed via phone call"
}
```

**Valid Statuses:**
- `pending` - Initial status
- `confirmed` - Order confirmed by admin
- `processing` - Order being prepared
- `completed` - Order fulfilled
- `cancelled` - Order cancelled

**Response:**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "order": {
      "id": 1,
      "status": "confirmed",
      ...
    }
  }
}
```

---

## 🎨 Frontend Flow

### Drinks Selection Page ([drinks-selection.html](drinks-selection.html))

**Step 1: Package Selection**
- Customer arrives from package selection page
- Package info stored in sessionStorage

**Step 2: Drink Selection**
- Customer checks cocktails, shooters, mocktails
- Real-time validation against package limits
- Selected drinks display updates automatically

**Step 3: Customer Information** (Shows when drinks selected)
```html
<form id="customerInfoForm">
  <!-- Full Name (required) -->
  <!-- Email (required) -->
  <!-- Phone (optional) -->
  <!-- Event Location (required) -->
  <!-- City, Province, Postal Code (optional) -->
  <!-- Guest Count (optional) -->
  <!-- Event Date (optional) -->
  <!-- Special Requests (optional) -->
</form>
```

**Step 4: Submission**
- Validates all required fields
- Shows loading state
- Submits to backend API
- Displays success message with order ID
- Redirects to homepage

### Customer Form Styling
- Dark theme with glassmorphism effect
- Red accent colors matching brand
- Responsive grid layout
- Input focus states with color transitions
- Form validation with error messages

---

## 🖥️ Admin Panel Updates

### New Tab: "🛒 Customer Orders"

**Orders Table Columns:**
1. **Order ID** - Unique identifier (#1, #2, etc.)
2. **Customer** - Name, email, phone
3. **Package** - Package name, price, guest count
4. **Location** - Event location, city, province
5. **Drinks Selected** - Button to view drinks modal
6. **Event Date** - Scheduled date or "TBD"
7. **Status** - Badge with color coding
8. **Created** - Order creation date
9. **Actions** - Dropdown to update status

**Features:**
- **View Drinks Button** - Opens modal showing all selected drinks
- **Status Dropdown** - Quick status updates
- **Color-Coded Badges:**
  - 🟡 Pending (Orange)
  - 🟢 Confirmed (Green)
  - 🔵 Processing (Blue)
  - ✅ Completed (Green)
  - 🔴 Cancelled (Red)

**Statistics Cards:**
- Total Customer Orders
- Pending Orders (needs attention)

---

## 💻 JavaScript Implementation

### drinks-selection.js Updates

**New Functions:**

```javascript
// Show customer form when drinks selected
function updateSelectedDrinksList() {
  // Shows/hides customer info section based on drink selection
  // Updates selected drinks display
  // Stores in sessionStorage
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Form submission handler
proceedBtn.addEventListener('click', async function() {
  // Validate drinks selected
  // Validate customer information
  // Prepare order data
  // Submit to API
  // Handle success/error
  // Redirect to homepage
})
```

**Form Validation:**
1. At least one drink must be selected
2. Customer name (min 2 characters)
3. Valid email format
4. Event location (min 5 characters)

---

## 📊 Usage Examples

### Customer Journey

1. **Browse Packages**
   ```
   Customer clicks "Select This Package" on drinks-packages.html
   ```

2. **Select Drinks**
   ```javascript
   // Customer selects:
   - Frozen Margarita ✓
   - Tequila Sunrise ✓
   - Mojito ✓
   ```

3. **Fill Information**
   ```
   Name: Juan Dela Cruz
   Email: juan@example.com
   Phone: +63 912 345 6789
   Location: Grand Ballroom, Manila Hotel
   City: Manila
   Province: Metro Manila
   Guests: 100
   Date: 2026-06-15
   ```

4. **Submit Order**
   ```
   ✅ Order #1 submitted successfully!
   Redirects to homepage
   ```

### Admin Workflow

1. **View New Order**
   ```
   Admin Panel → Customer Orders Tab
   See: Order #1 (Pending) - Juan Dela Cruz
   ```

2. **Review Details**
   ```
   Click "🍹 View (3)" to see selected drinks
   Modal shows: Margarita, Sunrise, Mojito
   ```

3. **Confirm Order**
   ```
   Status Dropdown → Select "Confirm"
   Alert: ✅ Order #1 updated to "confirmed"
   Badge turns green
   ```

---

## 🎨 Styling

### Customer Form CSS ([styles.css](styles.css))

```css
.customer-info-section {
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(221, 0, 0, 0.2);
  border-radius: 12px;
}

.form-group input {
  padding: 0.8rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.form-group input:focus {
  border-color: var(--secondary-color);
  background: rgba(0, 0, 0, 0.4);
}
```

### Admin Table Styling

- Responsive table layout
- Hover effects on rows
- Color-coded status badges
- Dropdown styling for status updates
- Modal for drink viewing

---

## 🔧 Integration Points

### Session Storage
```javascript
// Package info (from package selection)
sessionStorage.setItem('packageInfo', JSON.stringify({
  id: 'unlimited-4hr-100',
  name: '4hrs Unlimited Drink - 100 Pax',
  price: '₱10,500'
}));

// Selected drinks
sessionStorage.setItem('selectedDrinks', JSON.stringify([
  'Frozen Margarita',
  'Tequila Sunrise'
]));
```

### API Configuration
```javascript
// Uses global config
const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:5000';
```

---

## 📝 Testing Checklist

### Customer-Side Testing:
- [ ] Select package and navigate to drinks page
- [ ] Select multiple drinks
- [ ] Verify customer form appears
- [ ] Submit with missing required fields (should show validation)
- [ ] Submit with invalid email (should show validation)
- [ ] Submit valid order
- [ ] Verify success message shows order ID
- [ ] Verify redirect to homepage

### Admin-Side Testing:
- [ ] View orders tab in admin panel
- [ ] Verify order appears in table
- [ ] Click "View Drinks" button
- [ ] Verify all selected drinks shown in modal
- [ ] Update order status via dropdown
- [ ] Verify status badge color changes
- [ ] Check statistics cards updated

### API Testing:
- [ ] POST /api/orders/create with valid data
- [ ] POST /api/orders/create with missing fields (should fail)
- [ ] GET /api/orders/list
- [ ] GET /api/orders/:id
- [ ] PUT /api/orders/:id/status
- [ ] GET /api/admin/statistics (includes order counts)

---

## 🚀 Deployment Notes

1. **Database Migration**
   - Server automatically creates `customer_orders` table on start
   - No manual migration needed

2. **Environment Variables**
   - Same `.env` configuration as before
   - No additional variables required

3. **Frontend Updates**
   - Update [drinks-selection.html](drinks-selection.html)
   - Update [drinks-selection.js](drinks-selection.js)
   - Update [styles.css](styles.css)
   - Update [admin.html](admin.html)

4. **Backend Updates**
   - New route file: [backend/routes/orders.js](backend/routes/orders.js)
   - Updated: [backend/server.js](backend/server.js) (route registration)
   - Updated: [backend/database.js](backend/database.js) (new table)
   - Updated: [backend/routes/admin.js](backend/routes/admin.js) (statistics)

---

## 🎉 Benefits

### For Customers:
- ✅ Complete order in one page
- ✅ No need to call or email separately
- ✅ Immediate order confirmation
- ✅ Can specify exact location details
- ✅ Can add special requests upfront

### For Business:
- ✅ Structured customer data
- ✅ Complete location information for logistics
- ✅ Drink preferences captured upfront
- ✅ Organized order management
- ✅ Status tracking for team coordination
- ✅ Better event planning with guest count

---

## 📞 Customer Support

If customers have questions:
- Email: jiggeronthemix.atyourservice@gmail.com
- Phone: +63 995-551-1748
- They receive order ID in confirmation message
- Can reference order ID when contacting support

---

**Last Updated:** March 4, 2026  
**Version:** 1.0.0  
**Author:** JiggerOnTheMix Development Team
