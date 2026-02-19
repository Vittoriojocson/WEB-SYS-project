# 🚀 Deployment Guide

This guide will help you deploy your JiggerOnTheMix website online.

## 📋 Prerequisites

1. GitHub account
2. Render account (sign up at https://render.com - it's free!)
3. Git installed on your computer

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Initialize Git Repository

```bash
cd /Users/vittoriojocson/Desktop/school/CSS122/WEBSITE/WEB-SYS-project
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Name it `jiggeronthemix-website` (or any name you prefer)
3. **Don't** initialize with README (you already have files)
4. Click "Create repository"

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/jiggeronthemix-website.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your `jiggeronthemix-website` repository
5. Configure the service:
   - **Name**: `jiggeronthemix-api`
   - **Region**: Oregon (US West) - or closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 2.2 Add Environment Variables

In the "Environment Variables" section, add:

```
NODE_ENV=production
PORT=5000
DATABASE_URL=sqlite:///data/jiggeronthemix.db
CORS_ORIGINS=https://YOUR_GITHUB_USERNAME.github.io
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-gmail-app-password
MAIL_SENDER=JiggerOnTheMix <noreply@jiggeronthemix.com>
```

**Note**: For Gmail, you need to generate an "App Password":
- Go to https://myaccount.google.com/apppasswords
- Generate a new app password for "Mail"
- Use that 16-character password (not your regular password)

### 2.3 Add Persistent Disk (for database)

1. Scroll to "Disks" section
2. Click "Add Disk"
3. **Name**: `data`
4. **Mount Path**: `/data`
5. **Size**: 1 GB

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. Once deployed, copy your backend URL (looks like: `https://jiggeronthemix-api.onrender.com`)

---

## 🌐 Step 3: Deploy Frontend to GitHub Pages

### 3.1 Update API URL in config.js

1. Open `config.js` in your project
2. Replace the `PRODUCTION_API_URL` with your Render backend URL:

```javascript
PRODUCTION_API_URL: 'https://jiggeronthemix-api.onrender.com',
```

3. Save and commit:

```bash
git add config.js
git commit -m "Update production API URL"
git push
```

### 3.2 Enable GitHub Pages

1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click "Save"
5. Wait 1-2 minutes
6. Your site will be live at: `https://YOUR_USERNAME.github.io/jiggeronthemix-website/`

### 3.3 Update CORS in Render

1. Go back to your Render dashboard
2. Open your web service
3. Go to "Environment"
4. Update the `CORS_ORIGINS` variable with your GitHub Pages URL:

```
CORS_ORIGINS=https://YOUR_USERNAME.github.io
```

5. Save (this will trigger a redeploy)

---

## ✅ Step 4: Test Your Deployment

1. Visit your GitHub Pages URL
2. Try submitting the contact form
3. Try subscribing to the newsletter
4. Check if emails are being sent

---

## 🔍 Troubleshooting

### Backend not responding
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly
- Make sure disk is mounted at `/data`

### CORS errors
- Ensure `CORS_ORIGINS` includes your frontend URL
- Check browser console for specific error messages

### Database errors
- Verify the persistent disk is attached
- Check that `DATABASE_URL` points to `/data/` directory

### Email not sending
- Verify Gmail app password (not regular password)
- Check `MAIL_USERNAME` and `MAIL_PASSWORD` are correct
- Enable "Less secure app access" in Gmail (if needed)

---

## 📱 Alternative Hosting Options

### Frontend Alternatives:
- **Netlify**: Drag & drop deployment, easy custom domains
- **Vercel**: Fast deployment, great for static sites
- **Cloudflare Pages**: Free, fast CDN

### Backend Alternatives:
- **Railway**: Similar to Render, easy setup
- **Fly.io**: Good free tier, more control
- **Cyclic**: Specifically for Node.js apps

---

## 💡 Pro Tips

1. **Custom Domain**: Both GitHub Pages and Render support custom domains (e.g., `www.jiggeronthemix.com`)
2. **HTTPS**: Both services provide free SSL certificates automatically
3. **Monitoring**: Render free tier spins down after 15 minutes of inactivity (first request may take 30-60 seconds)
4. **Database Backups**: Download your SQLite database regularly from Render
5. **Environment Variables**: Never commit `.env` file to GitHub (it's in `.gitignore`)

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- GitHub Pages Docs: https://docs.github.com/en/pages
- Submit an issue on your GitHub repository

---

**Ready to deploy? Follow the steps above! 🎉**
