const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testLocal = async () => {
  console.log('🧪 Testing localhost application...');

  try {
    // 1. Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthRes = await axios.get('http://localhost:5000/health');
    if (healthRes.status === 200 && healthRes.data.status === 'ok') {
      console.log('✅ Health endpoint working');
    } else {
      console.log('❌ Health endpoint failed:', healthRes.data);
    }
  } catch (error) {
    console.log('❌ Health endpoint failed:', error.message);
  }

  try {
    // 2. Test login with test accounts
    console.log('\n2. Testing login with test accounts...');
    
    const testAccounts = [
      { email: 'admin@acme.test', password: 'password', tenant: 'acme' },
      { email: 'user@acme.test', password: 'password', tenant: 'acme' },
      { email: 'admin@globex.test', password: 'password', tenant: 'globex' },
      { email: 'user@globex.test', password: 'password', tenant: 'globex' }
    ];

    for (const account of testAccounts) {
      try {
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
          email: account.email,
          password: account.password
        });
        if (loginRes.status === 200) {
          console.log(`✅ Login successful for ${account.email}`);
          
          // Test notes endpoint
          const token = loginRes.data.token;
          try {
            const notesRes = await axios.get(`${API_URL}/notes`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`✅ Notes endpoint working for ${account.email} (${notesRes.data.length} notes)`);
          } catch (error) {
            console.log(`❌ Notes endpoint failed for ${account.email}:`, error.response?.data?.message || error.message);
          }
        } else {
          console.log(`❌ Login failed for ${account.email}:`, loginRes.data);
        }
      } catch (error) {
        console.log(`❌ Login failed for ${account.email}:`, error.response?.data?.message || error.message);
      }
    }

  } catch (error) {
    console.error('An unexpected error occurred:', error.message);
  } finally {
    console.log('\n🎉 Local testing completed!');
  }
};

testLocal();
