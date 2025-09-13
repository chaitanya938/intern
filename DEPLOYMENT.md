# Deployment Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
node setup.js
```

### 2. Seed Database
```bash
cd server
node seed.js
```

### 3. Start Development
```bash
npm run dev
```

## 🌐 MongoDB Configuration

Your MongoDB connection is already configured:
- **Database**: `mongodb+srv://gnanavardhini2_db_user:gnanavardhini@internshalassignment.ed9vdpa.mongodb.net/`
- **Password**: `gnanavardhini`

## 🔧 Environment Variables

### For Local Development
The application will use the MongoDB connection string automatically.

### For Vercel Deployment

#### Backend Environment Variables:
```env
MONGODB_URI=mongodb+srv://gnanavardhini2_db_user:gnanavardhini@internshalassignment.ed9vdpa.mongodb.net/?retryWrites=true&w=majority&appName=Internshalassignment
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-secure
NODE_ENV=production
```

#### Frontend Environment Variables:
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

## 📱 Test Accounts

All accounts use password: `password`

| Email | Role | Tenant | Subscription |
|-------|------|--------|-------------|
| admin@acme.test | Admin | Acme | Free |
| user@acme.test | Member | Acme | Free |
| admin@globex.test | Admin | Globex | Free |
| user@globex.test | Member | Globex | Free |

## 🚀 Vercel Deployment Steps

### 1. Deploy Backend
```bash
cd server
vercel --prod
```

### 2. Deploy Frontend
```bash
cd client
vercel --prod
```

### 3. Update CORS
Update the CORS origin in `server/index.js` with your frontend URL.

## ✅ Verification

1. **Health Check**: `GET /health` should return `{"status": "ok"}`
2. **Login**: Test all 4 accounts
3. **Notes**: Create, read, update, delete notes
4. **Tenant Isolation**: Verify data separation
5. **Subscription**: Test free plan limit and upgrade

## 🔍 Troubleshooting

### Common Issues:
1. **MongoDB Connection**: Check network access and credentials
2. **CORS Errors**: Update frontend URL in backend CORS config
3. **Build Failures**: Ensure all dependencies are installed
4. **Authentication**: Verify JWT_SECRET is set

### Debug Commands:
```bash
# Check MongoDB connection
cd server && node -e "require('./config/database')()"

# Test API endpoints
curl http://localhost:5000/health
```
