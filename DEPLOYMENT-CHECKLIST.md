# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment. Check off each item as you complete it.

## Pre-Deployment Setup

### Local Development
- [ ] Backend runs successfully locally (`npm start` in backend folder)
- [ ] Frontend displays correctly (http://localhost:8000)
- [ ] Contact form submits successfully
- [ ] Newsletter subscription works
- [ ] Emails are being sent (check spam folder)
- [ ] No console errors in browser (F12)
- [ ] All pages load correctly (index, bartenders, drinks-packages)

### Code Preparation
- [ ] `.env.example` file exists in backend folder
- [ ] `.gitignore` file exists in root (excludes .env, node_modules, .db files)
- [ ] `config.js` exists in root with DEVELOPMENT_API_URL set
- [ ] All HTML files include both config.js and script.js
- [ ] No sensitive data (passwords, API keys) in code
- [ ] Code is tested and working

## GitHub Setup

### Repository Creation
- [ ] GitHub account created/logged in
- [ ] New repository created (e.g., "jiggeronthemix-website")
- [ ] Repository is public (required for free GitHub Pages)
- [ ] Git initialized in project folder (`git init`)
- [ ] All files added to git (`git add .`)
- [ ] Initial commit made (`git commit -m "Initial commit"`)
- [ ] Remote origin set to GitHub repository
- [ ] Code pushed to GitHub (`git push -u origin main`)

### Verify on GitHub
- [ ] All files visible in GitHub repository
- [ ] `.env` file is NOT visible (should be in .gitignore)
- [ ] `config.js` is visible
- [ ] All HTML, CSS, JS files are visible
- [ ] Backend folder and files are visible

## Backend Deployment (Render)

### Account Setup
- [ ] Render account created at https://render.com
- [ ] GitHub account connected to Render
- [ ] Email verified

### Web Service Creation
- [ ] New Web Service created
- [ ] GitHub repository selected
- [ ] Service configured:
  - [ ] Name: `jiggeronthemix-api` (or your choice)
  - [ ] Region: Selected (closest to you)
  - [ ] Branch: `main`
  - [ ] Root Directory: `backend`
  - [ ] Runtime: Node
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Instance Type: Free

### Environment Variables
- [ ] NODE_ENV = `production`
- [ ] PORT = `5000`
- [ ] DATABASE_URL = `sqlite:///data/jiggeronthemix.db`
- [ ] CORS_ORIGINS = (will update after frontend deployment)
- [ ] MAIL_SERVER = `smtp.gmail.com`
- [ ] MAIL_PORT = `587`
- [ ] MAIL_USERNAME = your Gmail address
- [ ] MAIL_PASSWORD = Gmail App Password (16 characters, no spaces)
- [ ] MAIL_SENDER = `JiggerOnTheMix <noreply@jiggeronthemix.com>`

### Persistent Disk
- [ ] Disk added to service
- [ ] Name: `data`
- [ ] Mount Path: `/data`
- [ ] Size: 1 GB

### Deployment
- [ ] "Create Web Service" clicked
- [ ] Deployment started
- [ ] Deployment completed (green "Live" status)
- [ ] Backend URL copied (e.g., https://jiggeronthemix-api.onrender.com)
- [ ] Health check works: Visit `https://your-backend.onrender.com/api/health`

## Frontend Deployment (GitHub Pages)

### Update Configuration
- [ ] `config.js` opened in editor
- [ ] PRODUCTION_API_URL updated with Render backend URL
- [ ] Changes committed: `git add config.js`
- [ ] Changes committed: `git commit -m "Update production API URL"`
- [ ] Changes pushed: `git push`

### Enable GitHub Pages
- [ ] Navigated to repository settings
- [ ] Clicked "Pages" in sidebar
- [ ] Source set to "Branch: main"
- [ ] Folder set to "/ (root)"
- [ ] "Save" clicked
- [ ] GitHub Pages URL noted (e.g., https://username.github.io/repo-name/)
- [ ] Waited 2-3 minutes for deployment
- [ ] Website accessible at GitHub Pages URL

### Update CORS
- [ ] Returned to Render dashboard
- [ ] Opened backend web service
- [ ] Navigate to "Environment" tab
- [ ] CORS_ORIGINS updated to include GitHub Pages URL
- [ ] Changes saved (triggers automatic redeploy)
- [ ] Redeployment completed

## Testing Deployment

### Frontend Tests
- [ ] Website loads at GitHub Pages URL
- [ ] All pages accessible (home, bartenders, drinks-packages)
- [ ] Images load correctly
- [ ] CSS styling applied correctly
- [ ] Navigation works
- [ ] Responsive design works on mobile (test with DevTools)
- [ ] No console errors (F12 → Console tab)

### Backend Tests
- [ ] Backend health check responds: Visit `/api/health`
- [ ] Contact form submission works
- [ ] Success notification appears after form submission
- [ ] Email received (check spam folder)
- [ ] Newsletter subscription works
- [ ] Welcome email received
- [ ] No CORS errors in browser console

### Full Integration Test
- [ ] Open deployed website
- [ ] Fill out contact form completely
- [ ] Submit form
- [ ] See success message
- [ ] Receive confirmation email
- [ ] Subscribe to newsletter
- [ ] Receive welcome email
- [ ] Test on mobile device (actual phone/tablet)

## Post-Deployment

### Documentation
- [ ] README.md contains correct URLs
- [ ] Update any documentation with live URLs
- [ ] Screenshot website for portfolio/documentation

### Monitoring
- [ ] Bookmark Render dashboard for monitoring
- [ ] Bookmark GitHub repository
- [ ] Note: Render free tier spins down after 15 mins inactivity
- [ ] First request after spin-down takes 30-60 seconds

### Optional Enhancements
- [ ] Set up custom domain (if desired)
- [ ] Configure custom domain DNS
- [ ] Update CORS_ORIGINS to include custom domain
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Add Google Analytics (if desired)

## Troubleshooting

If something doesn't work, check:

1. **Backend not responding**
   - Check Render logs for errors
   - Verify environment variables are set
   - Check disk is mounted at /data
   - Visit /api/health endpoint

2. **CORS errors**
   - Verify CORS_ORIGINS includes your frontend URL
   - Check for trailing slashes (should not have them)
   - Verify protocol (http vs https)

3. **Contact form not working**
   - Check browser console for errors
   - Verify backend URL in config.js
   - Test backend endpoint directly with curl
   - Check Render logs

4. **Emails not sending**
   - Verify Gmail App Password (not regular password)
   - Check MAIL_USERNAME and MAIL_PASSWORD
   - Look for email errors in Render logs
   - Check spam folder

5. **GitHub Pages not updating**
   - Check Actions tab for build status
   - Clear browser cache (Ctrl+Shift+R)
   - Wait a few minutes and try again
   - Verify branch is "main" and folder is "/"

## Success! 🎉

When all items are checked, your website is live and fully functional!

**Your Website**: https://yourusername.github.io/your-repo-name/
**Your Backend**: https://your-app.onrender.com
**Backend Health**: https://your-app.onrender.com/api/health

Share your website link and celebrate! 🥳

---

**Need Help?** See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.
