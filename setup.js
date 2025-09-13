const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up Multi-Tenant Notes Application...\n');

try {
  // Install root dependencies
  console.log('📦 Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Install server dependencies
  console.log('📦 Installing server dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });

  // Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });

  console.log('\n✅ Dependencies installed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: cd server && node seed.js (to populate test data)');
  console.log('2. Run: npm run dev (to start development servers)');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('\n🔐 Test accounts (password: password):');
  console.log('- admin@acme.test (Admin, Acme)');
  console.log('- user@acme.test (Member, Acme)');
  console.log('- admin@globex.test (Admin, Globex)');
  console.log('- user@globex.test (Member, Globex)');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
