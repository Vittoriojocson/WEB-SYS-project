# JiggerOnTheMix Backend API

Node.js/Express backend for the JiggerOnTheMix bartending service website.

## Features

- **Contact Management**: Receive and manage contact form submissions with automated replies
- **Newsletter Subscription**: Email subscription system with duplicate prevention and reactivation support
- **Event Booking**: Create and manage event bookings with pricing tiers (Professional/Elite)
- **Email Service**: SMTP-based email sending via Gmail with HTML templates
- **Admin Dashboard**: Statistics and email logging for management
- **Data Persistence**: SQLite database with relational schema

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **Database**: SQLite3
- **Email**: Nodemailer with Gmail SMTP
- **Development**: Nodemon for hot reload

## Installation

### Prerequisites

- Node.js 16+ and npm
- Gmail account with 2-factor authentication enabled (for email sending)

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `body-parser` - JSON request parsing
- `sqlite3` - Database
- `nodemailer` - Email sending
- `dotenv` - Environment configuration
- `nodemon` - Development hot reload (dev dependency)

### Step 2: Configure Environment

Create a `.env` file in the backend directory with:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=./database.db
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Gmail SMTP Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_SENDER=JiggerOnTheMix <your-email@gmail.com>
```

#### Setting up Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled
3. Go to "App passwords" section
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password
6. Paste as `MAIL_PASSWORD` in `.env` (without spaces)

**⚠️ Important**: Never use your actual Gmail password. Use the 16-character app-specific password instead.

### Step 3: Run Development Server

```bash
npm run dev
```

Server starts on `http://localhost:5000`

You should see:
```
✓ Connected to SQLite database
✓ Database schema initialized
✓ Server running on http://0.0.0.0:5000
```

### Production Build

```bash
npm start
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

### Health Check

```
GET /health
```

Returns server status and database connection health.

### Contact Management

#### Submit Contact Form
```
POST /contact/submit
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "event_name": "Wedding Reception",
  "package": "Professional",
  "details": "Looking for bartender services for 150 guests on June 15th"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Contact message submitted. Reply sent to email.",
  "status_code": 201,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### List Contacts
```
GET /contact/list?status=new
```

Query params:
- `status`: `new`, `viewed`, or `responded` (optional)

#### Get Single Contact
```
GET /contact/:id
```

#### Update Contact Status
```
PUT /contact/:id/status
Content-Type: application/json

{
  "status": "responded",
  "notes": "Client confirmed booking for June 15th"
}
```

### Newsletter

#### Subscribe to Newsletter
```
POST /newsletter/subscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Subscription successful! Confirmation email sent.",
  "status_code": 201
}
```

#### Get Subscribers
```
GET /newsletter/subscribers
```

Optional params:
- `limit`: Number of results (default: 100)

#### Unsubscribe
```
POST /newsletter/unsubscribe/:email
```

### Event Booking

#### Create Booking
```
POST /booking/create
Content-Type: application/json

{
  "contact_id": 1,
  "package_type": "Professional",
  "event_date": "2024-06-15",
  "guest_count": 150
}
```

**Pricing Tiers**:
- Professional: ₱6,000 - ₱10,000
- Elite: ₱7,000 - ₱50,000+

#### List Bookings
```
GET /booking/list?status=confirmed
```

Query params:
- `status`: `pending`, `confirmed`, or `cancelled` (optional)

#### Get Booking
```
GET /booking/:id
```

#### Update Booking Status
```
PUT /booking/:id/status
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Admin Dashboard

#### Get Statistics
```
GET /admin/statistics
```

**Response**:
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "status_code": 200,
  "data": {
    "total_contacts": 15,
    "new_contacts": 3,
    "total_subscribers": 45,
    "total_bookings": 8,
    "confirmed_bookings": 6,
    "total_revenue": 125000
  }
}
```

#### Get Email Logs
```
GET /admin/email-logs?limit=50&status=sent
```

Query params:
- `limit`: Number of logs (default: 100)
- `status`: `sent` or `failed` (optional)

## Database Schema

### Tables

#### contact_messages
```sql
CREATE TABLE contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  event_name TEXT,
  package TEXT,
  details TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
)
```

#### newsletter_subscribers
```sql
CREATE TABLE newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  active INTEGER DEFAULT 1,
  unsubscribe_token TEXT
)
```

#### bookings
```sql
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_id INTEGER NOT NULL,
  package_type TEXT NOT NULL,
  event_date TEXT,
  guest_count INTEGER,
  price_quote REAL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contact_messages(id)
)
```

#### email_logs
```sql
CREATE TABLE email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient TEXT NOT NULL,
  subject TEXT,
  email_type TEXT,
  status TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT
)
```

## Frontend Integration

The frontend (script.js) is configured to call these endpoints:

1. **Contact Form** → `POST /api/contact/submit`
   - Called from `#contactForm` submission
   - Sends form data and displays success/error notification

2. **Newsletter** → `POST /api/newsletter/subscribe`
   - Called from footer newsletter button
   - Sends email and handles subscription response

3. **Event Booking** (Optional)
   - Can POST to `/api/booking/create`
   - Requires contact ID from contact form submission

### Testing Frontend Integration

1. Start backend: `npm run dev`
2. Open frontend in browser: `http://localhost:3000` (or file:// path)
3. Test contact form submission
4. Test newsletter subscription
5. Check browser console for any errors

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "errors": ["email is required", "email format is invalid"],
  "status_code": 400
}
```

Common error codes:
- **400**: Validation error (missing or invalid fields)
- **404**: Resource not found
- **409**: Conflict (e.g., duplicate email)
- **500**: Server error

## Development Tools

### Run Development Server with Hot Reload
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

### View Database
```bash
# Install sqlite3 if needed
npm install -g sqlite3

# View database
sqlite3 database.db
```

### Test API Endpoints

Using `curl`:
```bash
# Test contact submission
curl -X POST http://localhost:5000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","package":"Professional","details":"Test booking"}'

# Test newsletter
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"subscriber@example.com"}'

# Get statistics
curl http://localhost:5000/api/admin/statistics
```

Using Postman:
1. Import endpoints as HTTP requests
2. Set `BASEURL` variable to `http://localhost:5000/api`
3. Use provided request bodies as templates

## Troubleshooting

### Port 5000 Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Database Lock Error

SQLite file is locked by another process:
```bash
# Remove old database and recreate
rm database.db
npm run dev
```

### CORS Errors

Update `CORS_ORIGINS` in `.env`:
```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5000
```

### Email Not Sending

1. Check Gmail 2FA is enabled
2. Verify app-specific password (16 chars) copied correctly
3. Check `.env` has correct SMTP settings
4. Look for error messages in backend console

### Frontend Showing "Failed to send message"

1. Ensure backend is running on port 5000
2. Check browser console (F12) for network errors
3. Verify `CORS_ORIGINS` includes frontend URL
4. Confirm fetch URLs match backend API routes

## Production Deployment

### Environment Setup

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=/var/lib/app/database.db
CORS_ORIGINS=https://jiggersonthemix.com
FRONTEND_URL=https://jiggersonthemix.com
```

### Recommended Hosting

- **Heroku**: Easy Node.js deployment
- **DigitalOcean App Platform**: Affordable droplet hosting
- **AWS EC2**: Scalable cloud hosting
- **Railway/Render**: Simple deployment platforms

### Database Backup

```bash
# Backup SQLite database
cp database.db database.backup.db

# Restore from backup
cp database.backup.db database.db
```

### Performance Optimization

1. Add database indexes for frequently queried fields
2. Implement request rate limiting
3. Add request validation middleware
4. Use connection pooling for database
5. Cache admin statistics results

## Security Considerations

- ✅ Input validation on all endpoints
- ✅ Email format validation
- ✅ SQL parameter binding (no SQL injection)
- ✅ CORS configured for frontend origin only
- ✅ Environment variables for sensitive data
- ⚠️ TODO: Add authentication for admin endpoints
- ⚠️ TODO: Add rate limiting to prevent abuse
- ⚠️ TODO: Add HTTPS in production

### Recommended Security Additions

1. Add authentication middleware for `/admin` routes
2. Implement rate limiting: `npm install express-rate-limit`
3. Add helmet for security headers: `npm install helmet`
4. Hash sensitive data in database

Example:
```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

## License

This backend is part of the JiggerOnTheMix website project.

## Support

For issues or questions, check:
1. Browser console (F12) for frontend errors
2. Backend console output for server errors
3. `.env` file configuration
4. Database connectivity with `sqlite3 database.db`
5. Gmail app password setup

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Node.js Version**: 16+  
**Express Version**: 4.18.2
