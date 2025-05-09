const axios = require('axios');

// Test the education API endpoint
async function testEducationAPI() {
  try {
    console.log('Testing GET /api/admin/education endpoint...');
    const response = await axios.get('http://localhost:5000/api/admin/education');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error testing education API:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    console.error('Error config:', error.config);
    return null;
  }
}

// Run the test
testEducationAPI()
  .then(data => {
    if (data) {
      console.log('Test successful! Found', data.length, 'education entries');
    } else {
      console.log('Test failed!');
    }
  })
  .catch(err => console.error('Unexpected error:', err)); 