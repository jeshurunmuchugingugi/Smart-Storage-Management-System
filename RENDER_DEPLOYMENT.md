# Deploy to Render - Smart Storage Management System

## Prerequisites
- GitHub account
- Render account (free tier available)
- Push your code to GitHub repository

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `smart-storage-db`
   - **Database**: `smart_storage`
   - **User**: `smart_storage_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **Create Database**
5. Copy the **Internal Database URL** (starts with `postgres://`)

### 3. Deploy Backend API

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `smart-storage-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free

4. **Environment Variables** (click Advanced):
   ```
   DATABASE_URL = <paste Internal Database URL from step 2>
   FLASK_ENV = production
   JWT_SECRET_KEY = <generate random string>
   CORS_ORIGINS = https://smart-storage-frontend.onrender.com
   
   # Optional - M-Pesa (if using payments)
   MPESA_CONSUMER_KEY = <your key>
   MPESA_CONSUMER_SECRET = <your secret>
   MPESA_SHORTCODE = <your shortcode>
   MPESA_PASSKEY = <your passkey>
   MPESA_ENVIRONMENT = sandbox
   MPESA_CALLBACK_URL = https://smart-storage-api.onrender.com/api/mpesa/callback
   
   # Optional - SendGrid (if using emails)
   SENDGRID_API_KEY = <your key>
   SENDGRID_FROM_EMAIL = <your verified email>
   ```

5. Click **Create Web Service**
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL: `https://smart-storage-api.onrender.com`

### 4. Initialize Database

After backend deploys successfully:

1. Go to your backend service on Render
2. Click **Shell** tab
3. Run:
   ```bash
   python init_db.py
   ```
4. This creates tables and admin user (username: `admin`, password: `admin123`)

### 5. Deploy Frontend

1. Click **New +** → **Static Site**
2. Connect same GitHub repository
3. Configure:
   - **Name**: `smart-storage-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL = https://smart-storage-api.onrender.com
   ```

5. Click **Create Static Site**
6. Wait for deployment (5-10 minutes)
7. Your app is live at: `https://smart-storage-frontend.onrender.com`

### 6. Update CORS Origins

1. Go back to backend service settings
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS = https://smart-storage-frontend.onrender.com
   ```
3. Save changes (backend will redeploy)

## Alternative: Blueprint Deployment

Use the included `render.yaml` file:

1. Go to Render Dashboard
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` and create all services
5. Configure environment variables as needed
6. Click **Apply**

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Database has 90-day expiration (backup your data)

### Update Frontend API URL

If you didn't use environment variables, update manually:

**client/.env**:
```
REACT_APP_API_URL=https://smart-storage-api.onrender.com
```

### Database Migrations

When you update models:
```bash
# In Render Shell
flask db migrate -m "description"
flask db upgrade
```

### Monitoring

- Check logs in Render Dashboard → Service → Logs
- Monitor database usage in PostgreSQL service

## Troubleshooting

### Backend won't start
- Check logs for errors
- Verify DATABASE_URL is set correctly
- Ensure all required environment variables are set

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check CORS_ORIGINS includes frontend URL
- Check backend logs for CORS errors

### Database connection errors
- Verify DATABASE_URL format
- Check if database is running
- Ensure config.py handles postgres:// → postgresql:// conversion

### 500 Error on M-Pesa
- This is expected if M-Pesa credentials aren't configured
- App works without M-Pesa, just payment won't process
- Add M-Pesa credentials to fix

## Post-Deployment

1. Visit your frontend URL
2. Test admin login: `admin` / `admin123`
3. Change admin password immediately
4. Test booking flow
5. Monitor logs for errors

## Custom Domain (Optional)

1. Go to frontend service settings
2. Click **Custom Domain**
3. Add your domain
4. Update DNS records as instructed
5. Update CORS_ORIGINS in backend

## Costs

- **Free Tier**: $0/month
  - 750 hours/month web service
  - 100GB bandwidth
  - PostgreSQL with 90-day limit

- **Paid Plans**: Start at $7/month for always-on services

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
