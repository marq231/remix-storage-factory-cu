import fetch from 'node-fetch';

async function testEligibilityAPI() {
  console.log('\n===== TESTING ELIGIBILITY API ENDPOINT =====\n');

  const testData = {
    fullName: 'API Test User ' + Date.now(),
    country: 'US',
    ssn: '555-66-7777',
    idNumber: '123456789',
    bankField1: '987654321',
    bankField2: null,
    phone: '5551234567',
    email: 'apitest@example.com'
  };

  console.log('Sending request to API with data:');
  console.log(JSON.stringify(testData, null, 2));

  try {
    const response = await fetch('https://www.nextfundus.com/api/grants/eligibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log(`\nResponse Status: ${response.status}`);
    console.log(`Response Headers:`, {
      contentType: response.headers.get('content-type'),
      date: response.headers.get('date'),
    });

    const responseBody = await response.json();

    if (response.status === 200) {
      console.log('\n✓ API CALL SUCCESSFUL');
      console.log('Response:', JSON.stringify(responseBody, null, 2));

      if (responseBody.applicationCode) {
        console.log(`\nGenerated Code: ${responseBody.applicationCode}`);
        console.log(`Applicant Name: ${responseBody.fullName}`);

        // Now test the status endpoint
        console.log('\n--- Testing Status API ---');
        const statusResponse = await fetch(
          `https://www.nextfundus.com/api/grants/eligibility/status?code=${responseBody.applicationCode}`
        );

        const statusBody = await statusResponse.json();
        console.log(`Status Response:`, JSON.stringify(statusBody, null, 2));

        if (statusBody.fullName === 'Applicant') {
          console.error('\n❌ PROBLEM DETECTED: Status API returning "Applicant" instead of actual name');
          console.error(`Expected: "${responseBody.fullName}"`);
          console.error(`Got: "${statusBody.fullName}"`);
        } else {
          console.log(`\n✓ Name retrieved correctly: ${statusBody.fullName}`);
        }
      }
    } else {
      console.error('\n❌ API CALL FAILED');
      console.error('Response:', JSON.stringify(responseBody, null, 2));
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }

  console.log('\n===== TEST COMPLETE =====\n');
}

testEligibilityAPI();
