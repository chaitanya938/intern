#!/bin/bash

echo "Building frontend for Render deployment..."
echo "Current directory: $(pwd)"
echo "Available files: $(ls -la)"

# Make sure we're in the project root
if [ ! -d "client" ]; then
    echo "❌ Client directory not found in current location"
    echo "Trying to find client directory..."
    if [ -d "../client" ]; then
        echo "Found client directory one level up, changing to parent directory"
        cd ..
    elif [ -d "../../client" ]; then
        echo "Found client directory two levels up, changing to grandparent directory"
        cd ../..
    else
        echo "❌ Client directory not found anywhere"
        exit 1
    fi
fi

echo "Now in directory: $(pwd)"
echo "Client directory exists: $([ -d "client" ] && echo "YES" || echo "NO")"

# Change to the client directory
cd client
echo "Changed to client directory: $(pwd)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React app
echo "Building React app..."
npm run build

# Check if build was successful
if [ -f "build/index.html" ]; then
    echo "✅ Build successful! index.html found at client/build/index.html"
else
    echo "❌ Build failed! index.html not found"
    exit 1
fi

echo "Frontend build completed successfully!"
