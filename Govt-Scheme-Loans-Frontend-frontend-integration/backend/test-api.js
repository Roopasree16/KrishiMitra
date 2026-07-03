// Test script to verify API functionality
// Optional: Uncomment for Node.js < 18 compatibility
// const fetch = (...args) =>
//   import('node-fetch').then(({ default: fetch }) => fetch(...args));

const testSchemeRecommendation = async () => {
  const farmerData = {
    cropType: "Rice",
    detectedDisease: "Blast disease",
    lossType: "disease",
    lossSeverity: "high",
    state: "Andhra Pradesh",
    landholdingCategory: "small"
  };

  try {
    const response = await fetch('http://localhost:3000/api/recommend/schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData)
    });

    const result = await response.json();
    console.log('\n=== SCHEME RECOMMENDATIONS TEST ===');
    console.log('Status:', response.status);
    console.log('Success:', result.success);
    
    if (!result.success) {
      console.log('API Error:', result);
      return;
    }
    
    console.log('Total Recommendations:', result.totalRecommendations);
    console.log('\nRecommendations:');
    result.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.schemeName}`);
      console.log(`   Category: ${rec.category}`);
      console.log(`   Reason: ${rec.reason}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const testLoanRecommendation = async () => {
  const farmerData = {
    cropType: "Wheat",
    lossType: "drought",
    lossSeverity: "medium",
    state: "Punjab",
    landholdingCategory: "marginal"
  };

  try {
    const response = await fetch('http://localhost:3000/api/recommend/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData)
    });

    const result = await response.json();
    console.log('\n\n=== LOAN RECOMMENDATIONS TEST ===');
    console.log('Status:', response.status);
    console.log('Success:', result.success);
    
    if (!result.success) {
      console.log('API Error:', result);
      return;
    }
    
    console.log('Total Recommendations:', result.totalRecommendations);
    console.log('\nRecommendations:');
    result.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.loanName}`);
      console.log(`   Interest Rate: ${rec.interestRate}`);
      console.log(`   Reason: ${rec.reason}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Run tests
console.log('Testing Government Scheme & Loan Advisory API...\n');
testSchemeRecommendation().then(() => testLoanRecommendation());
