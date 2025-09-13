// Simple CORS test script
// Run this to test if CORS is working

const testCors = async () => {
  const frontendUrl = 'https://event-ticketing-o6r7.vercel.app';
  const backendUrl = 'https://event-ticketing-c8e8.onrender.com';
  
  console.log('Testing CORS configuration...');
  console.log('Frontend URL:', frontendUrl);
  console.log('Backend URL:', backendUrl);
  
  try {
    const response = await fetch(`${backendUrl}/api/events`, {
      method: 'GET',
      headers: {
        'Origin': frontendUrl,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ CORS is working!');
      console.log('Response status:', response.status);
    } else {
      console.log('❌ CORS failed');
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
};

// Run the test
testCors();
