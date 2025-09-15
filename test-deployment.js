const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testDeployment() {
  console.log('🧪 Testing deployment...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test auth endpoints
    console.log('\n2. Testing auth endpoints...');
    
    // Test registration
    const testUser = {
      email: 'test@example.com',
      password: 'testpassword123',
      tenant: 'test-tenant'
    };

    try {
      const registerResponse = await axios.post(`${API_URL}/api/auth/register`, testUser);
      console.log('✅ Registration endpoint working');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('✅ Registration endpoint working (user already exists)');
      } else {
        console.log('❌ Registration failed:', error.response?.data?.message || error.message);
      }
    }

    // Test login
    try {
      const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login endpoint working');
      
      const token = loginResponse.data.token;
      
      // Test protected endpoint
      console.log('\n3. Testing protected endpoints...');
      const meResponse = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Protected endpoint working:', meResponse.data.email);

      // Test notes endpoint
      const notesResponse = await axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Notes endpoint working');

    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testDeployment();
}

module.exports = testDeployment;
