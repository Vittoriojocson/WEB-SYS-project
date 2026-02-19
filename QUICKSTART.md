# ⚡ Quick Start Guide

## 🏃 Get Running in 5 Minutes

### For Local Development

1. **Start the Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your email settings
   npm start
   ```
   Backend runs at: http://localhost:5001

2. **Start the Frontend**
   ```bash
   # In a new terminal, from project root
   python3 -m http.server 8000
   ```
   Open: http://localhost:8000

### For Online Deployment

Run the deployment helper:
```bash
./deploy.sh
```

Or follow manual steps in [DEPLOYMENT.md](DEPLOYMENT.md)

## 🔑 Quick Links

- **Local Frontend**: http://localhost:8000
- **Local Backend**: http://localhost:5001
- **Backend Health Check**: http://localhost:5001/api/health
- **Full Instructions**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

## ⚙️ Essential Files to Configure

| File | What to Change | When |
|------|---------------|------|
| `backend/.env` | Email settings | Local dev |
| `config.js` | Production API URL | After backend deploy |
| `backend/.env` on Render | All settings | Production deploy |

## 🎯 Testing Checklist

- [ ] Backend health check responds: `curl http://localhost:5001/api/health`
- [ ] Contact form submits successfully
- [ ] Newsletter subscription works
- [ ] Email notifications arrive
- [ ] All pages load without errors

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| "Port already in use" | Kill process: `lsof -i :5001 \| awk '{print $2}' \| tail -n +2 \| xargs kill -9` |
| "Cannot connect to backend" | Check backend is running and CORS_ORIGINS is set |
| "Email not sending" | Use Gmail App Password, not regular password |
| "CORS error" | Add your frontend URL to CORS_ORIGINS in backend/.env |

---

**Need more help?** See [README.md](README.md) for detailed documentation.
