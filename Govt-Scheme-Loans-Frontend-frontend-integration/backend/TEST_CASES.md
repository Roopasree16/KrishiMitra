# Example Test Cases

## Test Case 1: High Severity Disease Loss in Andhra Pradesh

**Input:**
```json
{
  "cropType": "Rice",
  "detectedDisease": "Blast disease",
  "lossType": "disease",
  "lossSeverity": "high",
  "state": "Andhra Pradesh",
  "landholdingCategory": "small"
}
```

**Expected Schemes:**
- PMFBY (crop insurance)
- PM-KISAN (income support)
- Soil Health Card (advisory)
- Andhra Pradesh Crop Loss Compensation

**Expected Loans:**
- KCC (credit facility)
- MISS (interest subsidy)
- Agriculture Term Loan (for recovery)

---

## Test Case 2: Medium Severity Flood Loss in Punjab

**Input:**
```json
{
  "cropType": "Wheat",
  "lossType": "flood",
  "lossSeverity": "medium",
  "state": "Punjab",
  "landholdingCategory": "marginal"
}
```

**Expected Schemes:**
- PMFBY
- PM-KISAN
- Punjab Crop Loss Compensation Scheme

**Expected Loans:**
- KCC
- MISS

---

## Test Case 3: Low Severity Pest Damage in Karnataka

**Input:**
```json
{
  "cropType": "Cotton",
  "detectedDisease": "Bollworm infestation",
  "lossType": "pest",
  "lossSeverity": "low",
  "state": "Karnataka"
}
```

**Expected Schemes:**
- PMFBY
- PM-KISAN
- Soil Health Card

**Expected Loans:**
- KCC
- MISS

---

## Test Case 4: High Severity Drought in Maharashtra

**Input:**
```json
{
  "cropType": "Sugarcane",
  "lossType": "drought",
  "lossSeverity": "high",
  "state": "Maharashtra",
  "landholdingCategory": "others"
}
```

**Expected Schemes:**
- PMFBY
- PM-KISAN
- Maharashtra Crop Loss Relief Scheme

**Expected Loans:**
- KCC
- MISS
- Agriculture Term Loan

---

## Test Case 5: Invalid Input - Missing Required Field

**Input:**
```json
{
  "cropType": "Maize",
  "lossType": "disease",
  "state": "Telangana"
}
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    "lossSeverity is required"
  ]
}
```

---

## Test Case 6: Invalid Input - Wrong Loss Type

**Input:**
```json
{
  "cropType": "Tomato",
  "lossType": "fire",
  "lossSeverity": "high",
  "state": "Kerala"
}
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    "lossType must be one of: disease, pest, flood, drought, any"
  ]
}
```

---

## Test Case 7: Restricted Data Collection

**Input:**
```json
{
  "cropType": "Rice",
  "lossType": "flood",
  "lossSeverity": "medium",
  "state": "Bihar",
  "aadhaarNumber": "1234-5678-9012"
}
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    "Aadhaar number collection is not permitted"
  ]
}
```

---

## Test Case 8: State Without Specific Compensation Scheme

**Input:**
```json
{
  "cropType": "Jowar",
  "lossType": "drought",
  "lossSeverity": "high",
  "state": "Rajasthan",
  "landholdingCategory": "small"
}
```

**Expected Schemes:**
- PMFBY (national scheme)
- PM-KISAN (national scheme)
- No state-specific compensation (only national schemes)

**Expected Loans:**
- KCC
- MISS
- Agriculture Term Loan

---

## Running Test Cases

### Using cURL:

```bash
# Test Case 1
curl -X POST http://localhost:3000/api/recommend/schemes \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "Rice",
    "detectedDisease": "Blast disease",
    "lossType": "disease",
    "lossSeverity": "high",
    "state": "Andhra Pradesh",
    "landholdingCategory": "small"
  }'

# Test Case 2 (Loans)
curl -X POST http://localhost:3000/api/recommend/loans \
  -H "Content-Type: application/json" \
  -d '{
    "cropType": "Wheat",
    "lossType": "flood",
    "lossSeverity": "medium",
    "state": "Punjab",
    "landholdingCategory": "marginal"
  }'
```

### Using Node.js:

```javascript
const testCases = [
  {
    name: "High Severity Disease Loss",
    data: {
      cropType: "Rice",
      detectedDisease: "Blast disease",
      lossType: "disease",
      lossSeverity: "high",
      state: "Andhra Pradesh",
      landholdingCategory: "small"
    }
  },
  // Add more test cases...
];

async function runTests() {
  for (const test of testCases) {
    console.log(`\nTesting: ${test.name}`);
    
    const response = await fetch('http://localhost:3000/api/recommend/schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test.data)
    });
    
    const result = await response.json();
    console.log(`Success: ${result.success}`);
    console.log(`Recommendations: ${result.totalRecommendations}`);
  }
}

runTests();
```
