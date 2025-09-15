@echo off
echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "render.yaml" (
    echo ❌ render.yaml not found. Please run this script from the project root.
    exit /b 1
)

echo 📦 Building client...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client build failed!
    exit /b 1
)
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Client build failed!
    exit /b 1
)
echo ✅ Client build successful!

cd ..

echo 🔧 Testing server...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server dependencies installation failed!
    exit /b 1
)
echo ✅ Server dependencies installed successfully!

cd ..

echo 🎉 All checks passed! Ready for deployment.
echo.
echo To deploy to Render:
echo 1. Push your code to GitHub
echo 2. Connect your GitHub repo to Render
echo 3. Render will automatically detect render.yaml and deploy both services
echo.
echo Your services will be available at:
echo - Backend: https://notes-app-backend.onrender.com
echo - Frontend: https://notes-app-frontend.onrender.com
