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

// Always copy the directory (more reliable than symbolic links)
if (fs.existsSync(expectedDir)) {
  console.log('Removing existing src/client directory...');
  fs.rmSync(expectedDir, { recursive: true, force: true });
}

console.log('Copying client directory to src/client...');
copyDir(clientDir, expectedDir);
console.log('✅ Copied client directory to src/client');

// Verify the setup
console.log('Verifying setup...');
const publicDir = path.join(expectedDir, 'public');
const indexPath = path.join(publicDir, 'index.html');

console.log('Checking for public directory:', publicDir);
console.log('Public directory exists:', fs.existsSync(publicDir));

if (fs.existsSync(publicDir)) {
  console.log('Contents of public directory:', fs.readdirSync(publicDir));
  console.log('index.html exists:', fs.existsSync(indexPath));
} else {
  console.log('❌ Public directory not found!');
}

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

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
