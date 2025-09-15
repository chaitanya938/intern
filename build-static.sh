#!/bin/bash

echo "Building frontend for Render Static Site deployment..."

# Navigate to client directory
cd client

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

# Check if build was successful
if [ -f "build/index.html" ]; then
    echo "✅ Build successful! index.html found at client/build/index.html"
    echo "Build directory contents:"
    ls -la build/
else
    echo "❌ Build failed! index.html not found"
    echo "Current directory: $(pwd)"
    echo "Available files:"
    ls -la
    exit 1
fi

echo "Frontend build completed successfully!"
