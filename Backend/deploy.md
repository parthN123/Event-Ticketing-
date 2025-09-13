# Backend Deployment Instructions

## CORS Issue Fixed ✅

The backend has been updated to allow requests from your Vercel frontend.

### Changes Made:
- Added your Vercel URL (`https://event-ticketing-o6r7.vercel.app`) to allowed origins
- Added alternative Vercel URLs for flexibility
- Maintained local development support (`http://localhost:3000`)

### To Deploy Updated Backend:

1. **Commit and push changes to your repository:**
   ```bash
   git add .
   git commit -m "Fix CORS for Vercel deployment"
   git push origin main
   ```

2. **Render will automatically redeploy** your backend with the new CORS configuration.

3. **Wait for deployment to complete** (usually 2-3 minutes).

4. **Test the connection** by visiting your Vercel frontend and trying to log in.

### Alternative: Manual Deploy
If you need to manually trigger a deployment:
1. Go to your Render dashboard
2. Find your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

### Expected Result:
- ✅ CORS errors should be resolved
- ✅ Frontend can successfully communicate with backend
- ✅ Login and other API calls should work

### Troubleshooting:
If you still get CORS errors:
1. Check that the Vercel URL in the CORS config matches exactly
2. Clear browser cache and try again
3. Check Render logs for any deployment errors
