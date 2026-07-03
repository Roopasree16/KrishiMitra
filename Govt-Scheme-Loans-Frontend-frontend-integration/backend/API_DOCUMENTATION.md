# API Documentation

## Base URL
```
http://localhost:5006
```

## Authentication
No authentication required. This is a public advisory API.

---

## Endpoints

### 1. Health Check

**Endpoint:** `GET /`

**Description:** Check API status and get endpoint information.

**Response:**
```json
{
  "message": "Government Scheme & Loan Eligibility Advisory System",
  "version": "1.0.0",
  "status": "active",
  "endpoints": {
    "schemes": "POST /api/recommend/schemes",
    "loans": "POST /api/recommend/loans"
  }
}
```

---

### 2. Recommend Government Schemes

**Endpoint:** `POST /api/recommend/schemes`

**Description:** Get personalized government scheme recommendations based on crop loss data.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "cropType": "string (required)",
  "detectedDisease": "string (optional)",
  "lossType": "disease | pest | flood | drought | any (required)",
  "lossSeverity": "low | medium | high | any (required)",
  "state": "string (required)",
  "landholdingCategory": "small | marginal | others (optional)"
}
```

**Example Request:**
```json
{
  "cropType": "Rice",
  "detectedDisease": "Blast disease",
  "lossType": "disease",
  "lossSeverity": "high",
  "state": "Andhra Pradesh",
  "landholdingCategory": "small",
  "language": "te"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "farmerInput": {
    "cropType": "Rice",
    "detectedDisease": "Blast disease",
    "lossType": "disease",
    "lossSeverity": "high",
    "state": "Andhra Pradesh",
    "landholdingCategory": "small"
  },
  "totalRecommendations": 4,
  "recommendations": [
    {
      "schemeName": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      "schemeId": "pmfby",
      "category": "crop_insurance",
      "reason": "Covers disease loss. Applicable for high severity losses. Available across all states. Suitable for small landholders. Provides insurance coverage for future protection.",
      "eligibilitySummary": "Based on inputs: lossType=disease; severity=high; state=nationwide; landholding=small",
      "benefits": "Coverage against crop loss due to natural calamities, pests, and diseases. Premium subsidy provided by government.",
      "requiredDocuments": [
        "Land ownership documents / Tenancy agreement",
        "Bank account details",
        "Identity proof (as per scheme norms)",
        "Crop sowing certificate",
        "Premium payment receipt"
      ],
      "applicationChannel": "Banks / Common Service Centers (CSC) / Insurance companies",
      "officialLink": "https://pmfby.gov.in/",
      "disclaimer": "Final eligibility and approval depend on government authorities and financial institutions."
    }
  ],
  "systemDisclaimer": "This is an advisory system only. Final eligibility and approval depend on government authorities and financial institutions. Farmers must verify current scheme details from official government portals before applying.",
  "note": "This system does not collect Aadhaar, bank account numbers, or biometric data. It does not process or submit applications."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    "lossType must be one of: disease, pest, flood, drought, any",
    "lossSeverity must be one of: low, medium, high, any"
  ]
}
```

---

### 3. Recommend Loan Options

**Endpoint:** `POST /api/recommend/loans`

**Description:** Get personalized loan and credit recommendations for crop recovery.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "cropType": "string (required)",
  "detectedDisease": "string (optional)",
  "lossType": "disease | pest | flood | drought | any (required)",
  "lossSeverity": "low | medium | high | any (required)",
  "state": "string (required)",
  "landholdingCategory": "small | marginal | others (optional)",
  "language": "en | hi | te | ta | kn | ml (optional, defaults to en)",
  "language": "hi"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "language": "hi",
  "farmerInput": {
  "totalRecommendations": 2,
  "recommendations": [
    {
      "loanName": "Kisan Credit Card (KCC)",
      "loanId": "kcc",
      "category": "credit_facility",
      "reason": "Suitable for pest recovery. Quick access to working capital for next crop season. Available nationwide through banks. Priority lending for small and marginal farmers. Flexible credit with low documentation and insurance coverage.",
      "eligibilitySummary": "Interest rate: 4% per annum (with interest subvention up to ₹3 lakh) | Loan amount: Based on scale of finance and cropping pattern | Repayment: Up to 5 years with yearly renewal",
      "benefits": "Flexible credit limit, simple documentation, low interest rates (4-7% with subsidy), insurance coverage",
      "interestRate": "4% per annum (with interest subvention up to ₹3 lakh)",
      "loanAmount": "Based on scale of finance and cropping pattern",
      "repaymentPeriod": "Up to 5 years with yearly renewal",
      "requiredDocuments": [
        "Land ownership documents / Tenancy certificate",
        "Identity proof (as per bank norms)",
        "Address proof",
        "Recent passport-size photographs",
        "Bank account details"
      ],
      "applicationChannel": "Commercial Banks / Regional Rural Banks / Cooperative Banks",
      "officialLink": "https://www.nabard.org/content1.aspx?id=570&catid=8&mid=530",
      "disclaimer": "Final eligibility and approval depend on government authorities and financial institutions."
    }
  ],
  "systemDisclaimer": "This is an advisory system only. Final eligibility and approval depend on government authorities and financial institutions. Farmers must visit banks or financial institutions for actual loan application and approval.",
  "note": "This system does not collect Aadhaar, bank account numbers, or biometric data. It does not process or submit loan applications."
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Request completed successfully |
| 400 | Bad Request - Invalid input parameters |
| 404 | Not Found - Endpoint does not exist |
| 500 | Internal Server Error - Server-side error |

---

## Input Validation Rules

### Required Fields
- `cropType`: Any non-empty string
- `lossType`: Must be one of: `disease`, `pest`, `flood`, `drought`
- `lossSeverity`: Must be one of: `low`, `medium`, `high`
- `state`: Any non-empty string

### Optional Fields
- `detectedDisease`: Any string
- `landholdingCategory`: Must be one of: `small`, `marginal`, `others`
- `language`: Must be one of: `en`, `hi`, `te`, `ta`, `kn`, `ml` (defaults to `en`)

### Restricted Fields (Will cause validation error)
- `aadhaar` / `aadhaarNumber`
- `bankAccount` / `accountNumber`
- `biometric` / `fingerprint` / `iris`

---

## Response Structure

### Scheme Recommendation Object
```typescript
{
  schemeName: string,
  schemeId: string,
  category: "crop_insurance" | "income_support" | "advisory" | "state_crop_loss_relief",
  reason: string,
  eligibilitySummary: string,
  benefits: string,
  requiredDocuments: string[],
  applicationChannel: string,
  officialLink: string,
  disclaimer: string
}
```

### Loan Recommendation Object
```typescript
{
  loanName: string,
  loanId: string,
  category: "credit_facility" | "interest_subsidy" | "recovery_loan",
  reason: string,
  eligibilitySummary: string,
  benefits: string,
  interestRate: string,
  loanAmount: string,
  repaymentPeriod: string,
  requiredDocuments: string[],
  applicationChannel: string,
  officialLink: string,
  disclaimer: string
}
```

---

## State-Specific Schemes

The following states have dedicated crop loss compensation schemes:
- Andhra Pradesh
- Punjab
- Maharashtra
- Karnataka
- Telangana

Other states will receive recommendations for national schemes (PMFBY, PM-KISAN, etc.)

---

## Multilingual Support

The API supports recommendations in multiple Indian languages.

### Supported Languages

| Code | Language | Region |
|------|----------|--------|
| `en` | English | All India (default) |
| `hi` | Hindi | North India |
| `te` | Telugu | Andhra Pradesh, Telangana |
| `ta` | Tamil | Tamil Nadu |
| `kn` | Kannada | Karnataka |
| `ml` | Malayalam | Kerala |

### Usage

To receive recommendations in a specific language, include the `language` field in your request:

```json
{
  "cropType": "Rice",
  "lossType": "disease",
  "lossSeverity": "high",
  "state": "Telangana",
  "language": "te"
}
```

### Fallback Behavior

- If the `language` field is **missing or not provided**, the system defaults to **English (`en`)**.
- If an **unsupported language code** is provided (e.g., `"jp"`), the system automatically falls back to **English**.
- All **scheme and loan names, links, and identity enums remain in English** regardless of language setting.
- **Translation keys** that are missing in a language file gracefully fall back to English versions.

### Response Language

The response body (`reason`, `systemDisclaimer`, `note`) will be in the requested language. The `language` field in the response confirms the language used.

---

## Rate Limiting

Currently, no rate limiting is implemented. This is a local advisory system.

---

## Support

For API issues or questions:
- Check input validation rules
- Verify JSON format
- Ensure all required fields are provided
- Review example requests in this documentation
- Verify language code is one of: `en`, `hi`, `te`, `ta`, `kn`, `ml`
