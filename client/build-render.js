const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building React app for Render deployment...');
console.log('Current working directory:', process.cwd());
console.log('Available files:', fs.readdirSync('.'));

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found in current directory');
  process.exit(1);
}

if (!fs.existsSync('public')) {
  console.error('❌ public directory not found in current directory');
  process.exit(1);
}

if (!fs.existsSync('public/index.html')) {
  console.error('❌ public/index.html not found');
  console.log('Public directory contents:', fs.readdirSync('public'));
  process.exit(1);
}

console.log('✅ Found package.json and public/index.html');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the app
  console.log('Building React app...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if build was successful
  if (fs.existsSync('build/index.html')) {
    console.log('✅ Build successful!');
    console.log('Build directory contents:', fs.readdirSync('build'));
  } else {
    console.error('❌ Build failed! build/index.html not found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
