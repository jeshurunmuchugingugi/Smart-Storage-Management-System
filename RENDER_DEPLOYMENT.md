# Render Deployment Guide

## Backend Deployment (Flask API)

### 1. Prepare Backend
```bash
cd server
# Ensure requirements.txt has gunicorn
```

### 2. Deploy on Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `storage-backend`
   - **Root Directory**: `server`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python init_db.py`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: Free

### 3. Add Environment Variables
In Render dashboard, add these environment variables:
```
FLASK_PORT=10000
FLASK_HOST=0.0.0.0
SECRET_KEY=<auto-generate or paste your key>
JWT_SECRET_KEY=<auto-generate or paste your key>
MPESA_CONSUMER_KEY=<your-mpesa-key>
MPESA_CONSUMER_SECRET=<your-mpesa-secret>
MPESA_SHORTCODE=<your-shortcode>
MPESA_PASSKEY=<your-passkey>
MPESA_CALLBACK_URL=https://your-backend-url.onrender.com/api/mpesa/callback
```

### 4. Get Backend URL
After deployment, copy your backend URL:
```
https://storage-backend-xxxx.onrender.com
```

---

## Frontend Deployment (React)

### 1. Update Frontend API URL
Edit `client/.env`:
```env
REACT_APP_API_URL=https://storage-backend-xxxx.onrender.com
```

### 2. Update CORS in Backend
Edit `server/app.py` to allow your frontend domain:
```python
allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,https://your-frontend.onrender.com').split(',')
```

### 3. Deploy on Render
1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `storage-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### 4. Add Environment Variable
In Render dashboard:
```
REACT_APP_API_URL=https://storage-backend-xxxx.onrender.com
```

---

## Post-Deployment

### Update M-Pesa Callback URL
Update your M-Pesa callback URL in Safaricom Daraja portal:
```
https://storage-backend-xxxx.onrender.com/api/mpesa/callback
```

### Test the Application
1. Visit your frontend URL: `https://storage-frontend-xxxx.onrender.com`
2. Test admin login: `/admin/login` (admin/admin123)
3. Test booking and payment flow

---

## Important Notes

- **Free Tier**: Render free tier spins down after 15 minutes of inactivity (first request takes ~30 seconds)
- **Database**: SQLite works but consider PostgreSQL for production
- **HTTPS**: Render provides free SSL certificates
- **Logs**: Check Render dashboard for deployment and runtime logs

---

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure `gunicorn` is in requirements.txt

### Frontend can't connect to backend
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running (check Render dashboard)

### Database errors
- Run migrations: Add `flask db upgrade` to build command
- Or use PostgreSQL database (recommended for production)
