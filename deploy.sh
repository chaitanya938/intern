#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Building client..."
cd client
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed!"
    exit 1
fi
echo "✅ Client build successful!"

cd ..

echo "🔧 Testing server..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Server dependencies installation failed!"
    exit 1
fi
echo "✅ Server dependencies installed successfully!"

# Test server startup
timeout 10s npm start &
SERVER_PID=$!
sleep 5

# Test health endpoint
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Server health check passed!"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Server health check failed!"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

cd ..

echo "🎉 All checks passed! Ready for deployment."
echo ""
echo "To deploy to Render:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Render"
echo "3. Render will automatically detect render.yaml and deploy both services"
echo ""
echo "Your services will be available at:"
echo "- Backend: https://notes-app-backend.onrender.com"
echo "- Frontend: https://notes-app-frontend.onrender.com"
