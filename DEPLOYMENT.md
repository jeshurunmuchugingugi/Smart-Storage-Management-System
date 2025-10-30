# Deploy to Render - Step by Step

## Prerequisites
- GitHub account
- Render account (free at https://render.com)
- Push your code to GitHub

## Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy on Render

### Option A: Using Blueprint (Automated)
1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create all services automatically
5. Click "Apply" to deploy

### Option B: Manual Setup

#### Backend:
1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: storage-backend
   - **Root Directory**: server
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt && python init_db.py`
   - **Start Command**: `gunicorn app:app`
5. Add Environment Variables:
   - `JWT_SECRET_KEY`: (generate random string)
   - `SECRET_KEY`: (generate random string)
   - `DATABASE_URL`: (from PostgreSQL database)
   - `MPESA_CONSUMER_KEY`: (your M-Pesa key)
   - `MPESA_CONSUMER_SECRET`: (your M-Pesa secret)
   - `MPESA_SHORTCODE`: (your shortcode)
   - `MPESA_PASSKEY`: (your passkey)
   - `MPESA_CALLBACK_URL`: https://YOUR-BACKEND-URL.onrender.com/api/mpesa/callback
6. Click "Create Web Service"

#### Database:
1. Click "New" → "PostgreSQL"
2. Name: storage-db
3. Select free tier
4. Click "Create Database"
5. Copy the "Internal Database URL"
6. Add it to backend's `DATABASE_URL` environment variable

#### Frontend:
1. Click "New" → "Static Site"
2. Connect your GitHub repo
3. Configure:
   - **Name**: storage-frontend
   - **Root Directory**: client
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: build
4. Add Environment Variable:
   - `REACT_APP_API_URL`: https://YOUR-BACKEND-URL.onrender.com
5. Click "Create Static Site"

## Step 3: Update CORS in Backend

After deployment, update `server/app.py` CORS origins:
```python
CORS(app, 
     origins=["https://YOUR-FRONTEND-URL.onrender.com"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)
```

Commit and push changes - Render will auto-redeploy.

## Step 4: Test Your Deployment

1. Visit your frontend URL: https://YOUR-FRONTEND-URL.onrender.com
2. Test admin login with:
   - Username: admin
   - Password: admin123
3. Test storage units page
4. Test booking functionality

## Important Notes

- **Free Tier Limitations**:
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down takes 30-60 seconds
  - Database has 90-day expiration on free tier

- **Database**: Render uses PostgreSQL, not SQLite. Your app will automatically adapt.

- **Environment Variables**: Never commit sensitive keys to GitHub. Set them in Render dashboard.

- **Auto-Deploy**: Render automatically redeploys when you push to GitHub.

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in requirements.txt
- Verify Python version compatibility

### Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check database is running
- Ensure init_db.py ran successfully

### CORS Errors
- Update CORS origins with your actual frontend URL
- Ensure credentials are enabled
- Check browser console for specific errors

## Monitoring

- View logs: Render Dashboard → Your Service → Logs
- Check metrics: Dashboard → Your Service → Metrics
- Set up alerts: Dashboard → Your Service → Settings → Notifications

## Costs

- **Free Tier**: $0/month
  - 750 hours/month web service
  - 100GB bandwidth
  - PostgreSQL database (90 days)

- **Paid Tier**: $7/month per service
  - Always-on services
  - Persistent database
  - More resources

## Next Steps

1. Set up custom domain (optional)
2. Enable HTTPS (automatic on Render)
3. Configure M-Pesa for production
4. Set up monitoring and alerts
5. Create backup strategy for database
