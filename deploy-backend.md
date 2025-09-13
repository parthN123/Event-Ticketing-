# 🚀 Backend Deployment Instructions

## CORS Issue Fix

Your backend needs to be redeployed with the updated CORS configuration.

### Step 1: Deploy Backend Changes

```bash
# Navigate to backend directory
cd Backend

# Add all changes
git add .

# Commit changes
git commit -m "Fix CORS for Vercel deployment - allow event-ticketing-o6r7.vercel.app"

# Push to repository
git push origin main
```

### Step 2: Wait for Render Deployment
- Render will automatically detect the changes and redeploy
- Wait 2-3 minutes for deployment to complete
- Check Render dashboard for deployment status

### Step 3: Verify CORS Fix
After deployment, test your Vercel frontend:
1. Go to `https://event-ticketing-o6r7.vercel.app`
2. Try to log in
3. Check browser console - CORS errors should be gone

## Alternative: Manual Deploy
If automatic deployment doesn't work:
1. Go to your Render dashboard
2. Find your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

## Expected Result
- ✅ CORS errors resolved
- ✅ Login/registration works
- ✅ All API calls work
- ✅ QR code scanning works
