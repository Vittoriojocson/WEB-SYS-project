# 🔧 Render Deployment - Package.json Error Fix

## ❌ Error You're Seeing

```
error Couldn't find a package.json file in "/opt/render/project/src"
```

## ✅ Solution

This happens because Render is looking in the wrong directory. Your `package.json` is in the `backend` folder, not the root.

### Fix in Render Dashboard

1. **Go to your Render service settings**
   - Dashboard → Your Service → Settings

2. **Scroll to "Build & Deploy" section**

3. **Set Root Directory**
   - Find the field labeled **"Root Directory"**
   - Enter: `backend`
   - This tells Render to look inside the backend folder

4. **Verify other settings:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Runtime**: Node

5. **Save and redeploy**
   - Click "Save Changes"
   - Go to "Manual Deploy" → "Deploy latest commit"

---

## Alternative: Using render.yaml (Automatic Configuration)

If you want Render to automatically detect settings:

1. **The render.yaml file should be in your project ROOT** (already fixed)

2. **In Render, choose "Blueprint" option**
   - When creating service, select "New Blueprint Instance"
   - Render will read render.yaml automatically

3. **Commit and push the render.yaml**
   ```bash
   git add render.yaml
   git commit -m "Add Render configuration"
   git push
   ```

---

## Verify It's Fixed

After redeploying, you should see:
```
==> Running 'npm start'
...
✓ Server running on port 5000
```

Then test your backend:
- Visit: `https://your-app.onrender.com/api/health`
- Should return: `{"status":"ok","message":"JiggerOnTheMix API is running"}`

---

## Common Render Setup Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| Root Directory: (empty) | Root Directory: `backend` |
| Build Command: `yarn install` | Build Command: `npm install` |
| Start Command: `yarn start` | Start Command: `npm start` |
| Root Directory: `/backend` | Root Directory: `backend` |

---

## Still Having Issues?

1. **Check Render Logs**
   - Dashboard → Your Service → Logs
   - Look for the actual error message

2. **Verify package.json exists**
   - In GitHub, navigate to `backend/package.json`
   - Make sure the file exists

3. **Try Manual Deploy**
   - Dashboard → Manual Deploy → "Deploy latest commit"

4. **Delete and recreate service**
   - Sometimes starting fresh helps
   - Make sure to set Root Directory = `backend` from the start

---

## Need More Help?

See the full deployment guide: [DEPLOYMENT.md](DEPLOYMENT.md)
