# Manual Deployment Steps for Render.com

## Backend Service (Already Working)

### 1. Create New Web Service
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `chaitanya938/assigmnet`

### 2. Backend Configuration
- **Name**: `notes-app-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `master`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Backend Environment Variables
Add these environment variables in Render dashboard:
```
NODE_ENV = production
MONGODB_URI = mongodb+srv://gnanavardhini2_db_user:gnanavardhini@internshalassignment.ed9vdpa.mongodb.net/?retryWrites=true&w=majority&appName=Internshalassignment
JWT_SECRET = [Generate a strong random string]
PORT = 10000
```

### 4. Backend Advanced Settings
- **Auto-Deploy**: Yes
- **Plan**: Free

---

## Frontend Service (Manual Setup)

### 1. Create New Static Site
1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Select the repository: `chaitanya938/assigmnet`

### 2. Frontend Configuration
- **Name**: `notes-app-frontend`
- **Branch**: `master`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

### 3. Frontend Environment Variables
Add this environment variable:
```
REACT_APP_API_URL = https://notes-app-backend.onrender.com
```
*Note: Replace `notes-app-backend` with your actual backend service name*

### 4. Frontend Advanced Settings
- **Auto-Deploy**: Yes
- **Plan**: Free

---

## Important Notes

### Backend Service URL
After your backend deploys, you'll get a URL like:
`https://notes-app-backend-xxxxx.onrender.com`

### Frontend Environment Variable
Update the `REACT_APP_API_URL` in your frontend service to match your actual backend URL.

### CORS Configuration
The backend is already configured to accept requests from any origin, so CORS should work automatically.

---

## Testing After Deployment

### 1. Test Backend
Visit: `https://your-backend-url.onrender.com/health`
Should return: `{"status":"ok"}`

### 2. Test Frontend
Visit: `https://your-frontend-url.onrender.com`
Should load the React application

### 3. Test Full Flow
1. Register a new user
2. Login
3. Create a note
4. Test all features

---

## Troubleshooting

### If Frontend Build Fails
1. Check the build logs in Render dashboard
2. Ensure all dependencies are installed
3. Verify the build command is correct

### If API Calls Fail
1. Check that `REACT_APP_API_URL` is set correctly
2. Verify backend service is running
3. Check browser console for CORS errors

### If Backend Fails
1. Check environment variables
2. Verify MongoDB connection
3. Check server logs

---

## File Structure Reference
```
your-repo/
├── server/                 # Backend (Root Directory: server)
│   ├── package.json
│   ├── index.js
│   └── ...
├── client/                 # Frontend (Root Directory: client)
│   ├── package.json
│   ├── public/
│   ├── src/
│   └── build/              # Publish Directory
└── ...
```

---

## Quick Checklist
- [ ] Backend service created with correct root directory
- [ ] Backend environment variables set
- [ ] Backend deployed successfully
- [ ] Frontend service created with correct root directory
- [ ] Frontend environment variable set to backend URL
- [ ] Frontend deployed successfully
- [ ] Both services tested and working
