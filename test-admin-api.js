const fetch = require('node-fetch');

async function main() {
  try {
    // First login as admin
    console.log('Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5000/api/admin-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}), // Empty body is enough
    });

    if (!loginResponse.ok) {
      throw new Error(`Admin login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const user = await loginResponse.json();
    console.log('Logged in as:', user.username);
    
    // Get the cookies from the response
    const cookies = loginResponse.headers.get('set-cookie');
    
    // Test the admin stats endpoints
    console.log('\nTesting admin stats endpoints:');
    
    // Define our endpoints to test
    const endpoints = [
      '/api/admin/stats/users',
      '/api/admin/stats/resumes',
      '/api/admin/stats/jobs',
      '/api/admin/stats/subscriptions'
    ];
    
    // Test each endpoint
    for (const endpoint of endpoints) {
      console.log(`\nTesting ${endpoint}...`);
      const statsResponse = await fetch(`http://localhost:5000${endpoint}`, {
        headers: {
          Cookie: cookies
        }
      });
      
      if (!statsResponse.ok) {
        console.error(`Error fetching ${endpoint}: ${statsResponse.status} ${statsResponse.statusText}`);
        continue;
      }
      
      const stats = await statsResponse.json();
      console.log('Response:', stats);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();