#!/bin/bash

echo "Building React app for Render deployment..."
echo "Current directory: $(pwd)"
echo "Available files: $(ls -la)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in current directory"
    exit 1
fi

if [ ! -d "public" ]; then
    echo "❌ public directory not found in current directory"
    exit 1
fi

if [ ! -f "public/index.html" ]; then
    echo "❌ public/index.html not found"
    echo "Public directory contents: $(ls -la public/)"
    exit 1
fi

echo "✅ Found package.json and public/index.html"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building React app..."
npm run build

# Check if build was successful
if [ -f "build/index.html" ]; then
    echo "✅ Build successful!"
    echo "Build directory contents: $(ls -la build/)"
else
    echo "❌ Build failed! build/index.html not found"
    exit 1
fi
