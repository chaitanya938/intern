const fs = require('fs');
const path = require('path');

console.log('Setting up frontend for Render deployment...');

// Create the expected directory structure
const srcDir = path.join(__dirname, 'src');
const clientDir = path.join(__dirname, 'client');
const expectedDir = path.join(srcDir, 'client');

// Create src directory if it doesn't exist
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir, { recursive: true });
}

// Create symbolic link or copy client to src/client
if (!fs.existsSync(expectedDir)) {
  try {
    // Try to create a symbolic link first (works on Unix systems)
    fs.symlinkSync(clientDir, expectedDir, 'dir');
    console.log('✅ Created symbolic link: src/client -> client');
  } catch (error) {
    // If symbolic link fails, copy the directory
    console.log('Creating copy instead of symbolic link...');
    copyDir(clientDir, expectedDir);
    console.log('✅ Copied client directory to src/client');
  }
} else {
  console.log('✅ src/client directory already exists');
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Frontend setup completed!');
