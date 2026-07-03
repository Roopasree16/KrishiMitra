// Multilingual test script for Government Scheme Advisory API

const testLanguages = async () => {
  const baseUrl = 'http://localhost:3000/api/recommend';
  
  const testCases = [
    {
      name: 'English (Default)',
      language: 'en',
      data: {
        cropType: 'Rice',
        lossType: 'disease',
        lossSeverity: 'high',
        state: 'Andhra Pradesh',
        landholdingCategory: 'small'
      }
    },
    {
      name: 'Telugu',
      language: 'te',
      data: {
        cropType: 'Rice',
        lossType: 'disease',
        lossSeverity: 'high',
        state: 'Telangana',
        landholdingCategory: 'small',
        language: 'te'
      }
    },
    {
      name: 'Hindi',
      language: 'hi',
      data: {
        cropType: 'Wheat',
        lossType: 'drought',
        lossSeverity: 'medium',
        state: 'Punjab',
        landholdingCategory: 'marginal',
        language: 'hi'
      }
    },
    {
      name: 'Kannada',
      language: 'kn',
      data: {
        cropType: 'Cotton',
        lossType: 'pest',
        lossSeverity: 'high',
        state: 'Karnataka',
        language: 'kn'
      }
    },
    {
      name: 'Tamil',
      language: 'ta',
      data: {
        cropType: 'Sugarcane',
        lossType: 'drought',
        lossSeverity: 'medium',
        state: 'Tamil Nadu',
        language: 'ta'
      }
    },
    {
      name: 'Malayalam',
      language: 'ml',
      data: {
        cropType: 'Rice',
        lossType: 'flood',
        lossSeverity: 'high',
        state: 'Kerala',
        language: 'ml'
      }
    },
    {
      name: 'Fallback Test (unsupported language)',
      language: 'jp (fallback to en)',
      data: {
        cropType: 'Maize',
        lossType: 'pest',
        lossSeverity: 'low',
        state: 'Bihar',
        language: 'jp'
      }
    }
  ];

  console.log('\n=== Testing Multilingual Scheme Recommendations ===\n');

  for (const test of testCases) {
    try {
      console.log(`📍 ${test.name}`);
      
      const response = await fetch(`${baseUrl}/schemes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.data)
      });

      const result = await response.json();

      if (result.success) {
        console.log(`   ✓ Language Returned: ${result.language}`);
        console.log(`   ✓ Total Recommendations: ${result.totalRecommendations}`);
        
        if (result.recommendations.length > 0) {
          const firstRecommendation = result.recommendations[0];
          const reasonSnippet = firstRecommendation.reason.substring(0, 70);
          console.log(`   ✓ Sample Reason: "${reasonSnippet}..."`);
        }
        
        const disclaimerSnippet = result.systemDisclaimer.substring(0, 50);
        console.log(`   ✓ Disclaimer (sample): "${disclaimerSnippet}..."`);
      } else {
        console.log(`   ✗ Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`   ✗ Fetch Error: ${error.message}`);
    }
    
    console.log('');
  }

  // Test loans endpoint with one language
  console.log('=== Testing Loan Recommendations (Hindi) ===\n');
  
  const loanTest = {
    cropType: 'Wheat',
    lossType: 'drought',
    lossSeverity: 'high',
    state: 'Maharashtra',
    landholdingCategory: 'small',
    language: 'hi'
  };

  try {
    const response = await fetch(`${baseUrl}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanTest)
    });

    const result = await response.json();

    if (result.success) {
      console.log(`Language Returned: ${result.language}\n`);
      console.log(`Total Loan Recommendations: ${result.totalRecommendations}\n`);
      
      result.recommendations.forEach((loan, index) => {
        console.log(`${index + 1}. ${loan.loanName}`);
        console.log(`   Interest Rate: ${loan.interestRate}`);
        console.log(`   Reason: ${loan.reason.substring(0, 60)}...\n`);
      });
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  console.log('\n=== Multilingual Testing Complete ===\n');
};

testLanguages();
