# 🎵 JiggerOnTheMix - Mobile Bar & Events Website

A full-stack web application for a mobile bar service featuring event booking, contact forms, newsletter subscriptions, and admin management.

## 🚀 Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Event Booking System** - Contact form with package selection
- **Newsletter Subscription** - Email list management
- **Bartender Profiles** - Showcase your team
- **Drinks & Packages** - Display services and pricing
- **Email Notifications** - Automated email responses
- **Admin Dashboard** - Manage bookings and contacts
- **SQLite Database** - Lightweight data storage

## 📁 Project Structure

```
WEB-SYS-project/
├── index.html              # Homepage
├── bartenders.html         # Bartender profiles page
├── drinks-packages.html    # Drinks and packages page
├── styles.css              # All styling
├── script.js               # Frontend JavaScript
├── config.js               # Environment configuration
├── .gitignore             # Git ignore rules
├── DEPLOYMENT.md          # Deployment instructions
├── README.md              # This file
└── backend/
    ├── server.js          # Express server
    ├── database.js        # SQLite setup
    ├── utils.js           # Helper functions
    ├── package.json       # Node dependencies
    ├── .env.example       # Environment variables template
    ├── render.yaml        # Render deployment config
    └── routes/
        ├── admin.js       # Admin endpoints
        ├── booking.js     # Booking endpoints
        ├── contact.js     # Contact form endpoints
        └── newsletter.js  # Newsletter endpoints
```

## 🛠️ Local Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git
- Gmail account (for sending emails)

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env with your settings**
   ```
   NODE_ENV=development
   PORT=5001
   DATABASE_URL=sqlite:///jiggeronthemix.db
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-gmail-app-password
   MAIL_SENDER=JiggerOnTheMix <noreply@jiggeronthemix.com>
   CORS_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
   ```

   **Important**: Use Gmail App Password (not regular password):
   - Go to https://myaccount.google.com/apppasswords
   - Generate new app password for "Mail"
   - Use the 16-character password in .env

5. **Start the backend server**
   ```bash
   npm start
   ```
   
   Server runs at: http://localhost:5001

### Frontend Setup

1. **Navigate to project root**
   ```bash
   cd ..
   ```

2. **Start a local web server**
   
   Using Python:
   ```bash
   python3 -m http.server 8000
   ```
   
   Or using Node.js:
   ```bash
   npx http-server -p 8000
   ```

3. **Open in browser**
   
   Visit: http://localhost:8000

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions to:
- **Frontend**: GitHub Pages (or Netlify/Vercel)
- **Backend**: Render (or Railway/Fly.io)

**Quick deployment checklist:**
1. Push code to GitHub
2. Deploy backend to Render
3. Update `config.js` with backend URL
4. Deploy frontend to GitHub Pages
5. Update CORS_ORIGINS in backend environment variables

## 🔧 Configuration

### Frontend Configuration (config.js)

```javascript
PRODUCTION_API_URL: 'https://your-backend-app.onrender.com'
DEVELOPMENT_API_URL: 'http://localhost:5001'
```

The app automatically detects the environment and uses the correct URL.

### Backend Configuration (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` or `development` |
| `PORT` | Server port | `5001` |
| `DATABASE_URL` | SQLite database path | `sqlite:///jiggeronthemix.db` |
| `MAIL_SERVER` | SMTP server | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | Email account | `your-email@gmail.com` |
| `MAIL_PASSWORD` | Email password | Gmail App Password |
| `MAIL_SENDER` | From email display | `JiggerOnTheMix <...>` |
| `CORS_ORIGINS` | Allowed origins | Comma-separated URLs |

## 📡 API Endpoints

### Contact Form
- `POST /api/contact/submit` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "event_name": "Wedding",
    "package": "Professional",
    "details": "Need bartender for 100 guests"
  }
  ```

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
  ```json
  {
    "email": "john@example.com"
  }
  ```

### Health Check
- `GET /api/health` - Check if API is running

## 🗄️ Database

SQLite database with tables:
- **contacts** - Contact form submissions
- **bookings** - Event bookings
- **newsletter** - Email subscribers

Database is auto-created on first run at `backend/jiggeronthemix.db`

## 🧪 Testing

### Test Backend Health
```bash
curl http://localhost:5001/api/health
```

### Test Contact Form
```bash
curl -X POST http://localhost:5001/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","event_name":"Wedding","package":"Professional","details":"Test"}'
```

### Test Newsletter
```bash
curl -X POST http://localhost:5001/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🎨 Customization

### Update Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #FF6B35;
    --secondary-color: #004E89;
    --accent-color: #F77F00;
    --dark-bg: #1A1A2E;
}
```

### Add New Pages
1. Create new HTML file (e.g., `gallery.html`)
2. Include `config.js` and `script.js`:
   ```html
   <script src="config.js"></script>
   <script src="script.js"></script>
   ```
3. Add navigation link in navbar of all pages

### Modify Email Templates
Edit email content in:
- `backend/routes/contact.js` - Contact form emails
- `backend/routes/newsletter.js` - Newsletter emails

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5001 is already in use
- Verify all dependencies installed: `npm install`
- Check .env file exists and has correct values

### Frontend can't connect to backend
- Verify backend is running on correct port
- Check CORS_ORIGINS includes your frontend URL
- Check browser console for errors
- Verify config.js has correct API URLs

### Emails not sending
- Use Gmail App Password (not regular password)
- Enable "Less secure app access" in Gmail if needed
- Check MAIL_USERNAME and MAIL_PASSWORD in .env
- Check backend logs for email errors

### Database errors
- Delete `jiggeronthemix.db` to reset database
- Check file permissions on backend folder
- Verify DATABASE_URL path is correct

## 📝 License

This project is for educational purposes.

## 👥 Credits

- **Student**: Vittorio Jocson
- **Course**: CSS122 - Web Systems
- **Project**: Mobile Bar Service Website

## 🤝 Support

For issues or questions:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
2. Review error messages in browser console (F12)
3. Check backend logs for API errors
4. Verify environment variables are set correctly

---

**Made with ❤️ for JiggerOnTheMix**
