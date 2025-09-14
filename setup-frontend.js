const fs = require('fs');
const path = require('path');

console.log('Setting up frontend for Render deployment...');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Simple approach: try multiple possible locations for the client directory
const possibleClientDirs = [
  path.join(__dirname, '..', 'client'),  // Go up one level from src
  path.join(__dirname, '..', '..', 'client'),  // Go up two levels
  path.join(process.cwd(), 'client'),  // From current working directory
  path.join(process.cwd(), '..', 'client'),  // Up one from current working directory
];

// Use the original possible directories without filtering
const filteredClientDirs = possibleClientDirs;

let clientDir = null;
for (const dir of filteredClientDirs) {
  console.log('Checking for client directory at:', dir);
  if (fs.existsSync(dir) && fs.existsSync(path.join(dir, 'package.json'))) {
    clientDir = dir;
    console.log('✅ Found client directory at:', dir);
    break;
  }
}

if (!clientDir) {
  console.error('❌ Client directory not found in any expected location');
  console.log('Available files in current directory:', fs.readdirSync(process.cwd()));
  console.log('Available files in __dirname:', fs.readdirSync(__dirname));
  process.exit(1);
}

// Create the expected structure - copy to src/client (same level as setup script)
const expectedDir = path.join(__dirname, 'client');

console.log('Expected directory:', expectedDir);

// Remove existing src/client if it exists
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
