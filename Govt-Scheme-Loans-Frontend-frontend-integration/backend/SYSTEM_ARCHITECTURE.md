# System Architecture & Flow

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATION                        │
│              (Mobile App / Web App / API Client)             │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP POST Request
                            │ (Farmer + Crop Loss Data)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                          │
│                    (Port 3000 - Node.js)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   MIDDLEWARE LAYER                     │  │
│  │  • CORS Handler                                        │  │
│  │  • JSON Body Parser                                    │  │
│  │  • Error Handler                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  ROUTING LAYER                         │  │
│  │  • POST /api/recommend/schemes  (schemeRoutes.js)     │  │
│  │  • POST /api/recommend/loans    (loanRoutes.js)       │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              VALIDATION LAYER                          │  │
│  │  • validator.js                                        │  │
│  │    - Check required fields                             │  │
│  │    - Validate enums (lossType, lossSeverity)          │  │
│  │    - Block restricted data (Aadhaar, bank accounts)   │  │
│  │    - Sanitize input                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            BUSINESS LOGIC LAYER                        │  │
│  │  ┌──────────────────────┐  ┌──────────────────────┐   │  │
│  │  │ schemeMatchingEngine │  │ loanMatchingEngine   │   │  │
│  │  │                      │  │                      │   │  │
│  │  │ Rule-Based Matching: │  │ Rule-Based Matching: │   │  │
│  │  │ 1. Loss Type Match   │  │ 1. Loss Type Match   │   │  │
│  │  │ 2. Severity Check    │  │ 2. Severity Check    │   │  │
│  │  │ 3. State/Region Match│  │ 3. State Match       │   │  │
│  │  │ 4. Landholding Check │  │ 4. Landholding Check │   │  │
│  │  │ 5. Crop Type Match   │  │ 5. Generate Reason   │   │  │
│  │  │ 6. Generate Reason   │  │                      │   │  │
│  │  └──────────────────────┘  └──────────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   DATA LAYER                           │  │
│  │  ┌──────────────────┐      ┌──────────────────┐       │  │
│  │  │   schemes.js     │      │    loans.js      │       │  │
│  │  │  • PMFBY         │      │  • KCC           │       │  │
│  │  │  • PM-KISAN      │      │  • MISS          │       │  │
│  │  │  • Soil Health   │      │  • Term Loans    │       │  │
│  │  │  • State Schemes │      │                  │       │  │
│  │  └──────────────────┘      └──────────────────┘       │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │ JSON Response
                            │ (Recommendations + Disclaimer)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│         (Displays schemes/loans to farmer)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow (Detailed)

### Example: Farmer in Andhra Pradesh with Rice Disease Loss

```
STEP 1: CLIENT REQUEST
─────────────────────
POST http://localhost:3000/api/recommend/schemes
{
  "cropType": "Rice",
  "detectedDisease": "Blast disease",
  "lossType": "disease",
  "lossSeverity": "high",
  "state": "Andhra Pradesh",
  "landholdingCategory": "small"
}

        │
        ▼

STEP 2: MIDDLEWARE PROCESSING
──────────────────────────────
✓ CORS check passed
✓ JSON parsed
✓ Route matched: schemeRoutes.js

        │
        ▼

STEP 3: INPUT VALIDATION
─────────────────────────
validator.js checks:
✓ cropType present: "Rice"
✓ lossType valid: "disease" ∈ {disease, pest, flood, drought}
✓ lossSeverity valid: "high" ∈ {low, medium, high}
✓ state present: "Andhra Pradesh"
✓ landholdingCategory valid: "small" ∈ {small, marginal, others}
✓ No restricted data (aadhaar, bankAccount, biometric)

Sanitized Data:
{
  cropType: "Rice",
  detectedDisease: "Blast disease",
  lossType: "disease",            ← lowercase
  lossSeverity: "high",           ← lowercase
  state: "Andhra Pradesh",
  landholdingCategory: "small"    ← lowercase
}

        │
        ▼

STEP 4: SCHEME MATCHING (Rule-Based Engine)
────────────────────────────────────────────

For each scheme in schemes.js:

┌─────────────────────────────────────────────────┐
│ Scheme 1: PMFBY                                 │
├─────────────────────────────────────────────────┤
│ Rule 1: Loss Type?                              │
│   "disease" ∈ ["disease","pest","flood","drought"]│
│   ✓ PASS                                        │
│                                                  │
│ Rule 2: Severity?                               │
│   "high" ∈ ["low","medium","high"]             │
│   ✓ PASS                                        │
│                                                  │
│ Rule 3: State?                                  │
│   eligibility.states = "all"                    │
│   ✓ PASS (nationwide)                           │
│                                                  │
│ Rule 4: Landholding?                            │
│   "small" ∈ ["small","marginal","others"]      │
│   ✓ PASS                                        │
│                                                  │
│ Rule 5: Crop Type?                              │
│   eligibility.cropTypes = "all"                 │
│   ✓ PASS                                        │
│                                                  │
│ Result: ✅ ELIGIBLE                             │
│ Reason: "Covers disease loss. Applicable for    │
│          high severity losses. Available across │
│          all states. Suitable for small         │
│          landholders. Provides insurance        │
│          coverage for future protection."       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Scheme 2: PM-KISAN                              │
├─────────────────────────────────────────────────┤
│ Same rule evaluation...                         │
│ Result: ✅ ELIGIBLE                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Scheme 3: Soil Health Card                      │
├─────────────────────────────────────────────────┤
│ Same rule evaluation...                         │
│ Result: ✅ ELIGIBLE                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Scheme 4: AP Crop Loss Compensation             │
├─────────────────────────────────────────────────┤
│ Rule 3: State?                                  │
│   "Andhra Pradesh" ∈ ["Andhra Pradesh", "AP"]  │
│   ✓ PASS (state match!)                         │
│                                                  │
│ Rule 2: Severity?                               │
│   "high" ∈ ["medium","high"]                    │
│   ✓ PASS (high severity required)              │
│                                                  │
│ Result: ✅ ELIGIBLE                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Scheme 5: Punjab Crop Loss Compensation         │
├─────────────────────────────────────────────────┤
│ Rule 3: State?                                  │
│   "Andhra Pradesh" ∉ ["Punjab", "PB"]          │
│   ✗ FAIL                                        │
│                                                  │
│ Result: ❌ NOT ELIGIBLE                         │
└─────────────────────────────────────────────────┘

        │
        ▼

STEP 5: RESPONSE FORMATTING
────────────────────────────
{
  "success": true,
  "farmerInput": { ... },
  "totalRecommendations": 4,
  "recommendations": [
    {
      "schemeName": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      "schemeId": "pmfby",
      "category": "crop_insurance",
      "reason": "Covers disease loss. Applicable for high severity losses...",
      "eligibilitySummary": "Eligible for: disease, pest, flood, drought losses...",
      "benefits": "Coverage against crop loss...",
      "requiredDocuments": [...],
      "applicationChannel": "Banks / CSCs / Insurance companies",
      "officialLink": "https://pmfby.gov.in/",
      "disclaimer": "Final eligibility and approval depend on..."
    },
    { ... }, // PM-KISAN
    { ... }, // Soil Health Card
    { ... }  // AP Crop Loss Compensation
  ],
  "systemDisclaimer": "This is an advisory system only...",
  "note": "This system does not collect Aadhaar..."
}

        │
        ▼

STEP 6: CLIENT RECEIVES & DISPLAYS
───────────────────────────────────
Client app shows:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RECOMMENDED SCHEMES FOR YOU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 🛡️ PMFBY (Crop Insurance)
   Why: Covers disease loss for high severity
   Apply: Banks / CSCs
   Link: pmfby.gov.in

2. 💰 PM-KISAN (Income Support)
   Why: Direct income support ₹6,000/year
   Apply: CSCs / Online
   Link: pmkisan.gov.in

3. 🌱 Soil Health Card
   Why: Soil improvement reduces diseases
   Apply: Agriculture Dept
   Link: soilhealth.dac.gov.in

4. 🏛️ AP Crop Loss Compensation
   Why: State support for high losses in AP
   Apply: Agriculture Office
   Link: apagrisnet.gov.in

⚠️ Disclaimer: Advisory only. Visit banks
   and govt offices for actual application.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🧮 Matching Logic Pseudocode

```
FUNCTION matchSchemes(farmerData):
    recommendations = []
    
    FOR EACH scheme IN schemes_database:
        isEligible = TRUE
        reasons = []
        
        // Rule 1: Loss Type Match
        IF scheme.eligibility.lossTypes != "all":
            IF farmerData.lossType NOT IN scheme.eligibility.lossTypes:
                isEligible = FALSE
            ELSE:
                reasons.add("Covers " + farmerData.lossType + " loss")
        ELSE:
            reasons.add("Covers all loss types")
        
        // Rule 2: Severity Match
        IF scheme.eligibility.lossSeverity != "all":
            IF farmerData.lossSeverity NOT IN scheme.eligibility.lossSeverity:
                isEligible = FALSE
            ELSE:
                reasons.add("Applicable for " + farmerData.lossSeverity + " severity")
        
        // Rule 3: State Match
        IF scheme.eligibility.states != "all":
            IF farmerData.state NOT IN scheme.eligibility.states:
                isEligible = FALSE
            ELSE:
                reasons.add("Available in " + farmerData.state)
        ELSE:
            reasons.add("Available nationwide")
        
        // Rule 4: Landholding Match (optional)
        IF farmerData.landholdingCategory EXISTS:
            IF scheme.eligibility.landholdingCategories != "all":
                IF farmerData.landholdingCategory NOT IN scheme.eligibility.landholdingCategories:
                    isEligible = FALSE
                ELSE:
                    reasons.add("Suitable for " + farmerData.landholdingCategory)
        
        // Rule 5: Crop Type Match
        IF scheme.eligibility.cropTypes != "all":
            IF farmerData.cropType NOT IN scheme.eligibility.cropTypes:
                isEligible = FALSE
            ELSE:
                reasons.add("Covers " + farmerData.cropType)
        
        // Add to recommendations if eligible
        IF isEligible:
            recommendations.add({
                scheme: scheme,
                reason: reasons.join(". "),
                disclaimer: "Final eligibility depends on authorities..."
            })
    
    RETURN recommendations
```

---

## 🎯 Key Decision Points

### 1. When to Recommend Crop Insurance (PMFBY)?
```
IF (loss reported) AND (any loss type) AND (any severity):
    ✅ Recommend PMFBY
    REASON: "Provides insurance coverage for future protection"
```

### 2. When to Recommend Income Support (PM-KISAN)?
```
IF (farmer is a landowner) AND (any loss type):
    ✅ Recommend PM-KISAN
    REASON: "Direct income support to help recover from loss"
```

### 3. When to Recommend State Schemes?
```
IF (state has specific scheme) AND (severity >= medium):
    ✅ Recommend State Compensation
    REASON: "State-level compensation for verified crop losses"
```

### 4. When to Recommend KCC?
```
IF (any loss type) AND (any severity):
    ✅ Recommend KCC
    REASON: "Quick access to working capital for next season"
```

### 5. When to Recommend Recovery Loans?
```
IF (severity == "high") OR (severity == "medium"):
    ✅ Recommend Agriculture Term Loan
    REASON: "Long-term loan for capital investment and recovery"
```

---

## 📊 Data Flow Diagram

```
Input → Validation → Sanitization → Matching Engine → Output

┌─────────────┐
│   Farmer    │
│    Input    │
└──────┬──────┘
       │
       │ {cropType, lossType, lossSeverity, state, ...}
       │
       ▼
┌─────────────┐
│  Validator  │◄────── Checks:
└──────┬──────┘       • Required fields
       │              • Valid enums
       │              • No restricted data
       ▼
┌─────────────┐
│  Sanitize   │◄────── Normalize:
└──────┬──────┘       • Lowercase enums
       │              • Trim strings
       │              • Remove nulls
       ▼
┌─────────────┐
│   Matching  │◄────── Rules:
│   Engine    │       1. Loss Type
└──────┬──────┘       2. Severity
       │              3. State
       │              4. Landholding
       │              5. Crop Type
       ▼
┌─────────────┐
│    Build    │◄────── Add:
│  Response   │       • Scheme details
└──────┬──────┘       • Reasons
       │              • Documents
       │              • Links
       │              • Disclaimer
       ▼
┌─────────────┐
│   Return    │
│    JSON     │
└─────────────┘
```

---

## 🔐 Security & Validation Flow

```
Request Body
     │
     ▼
┌─────────────────────────────────┐
│  Check for Restricted Fields    │
│  • aadhaar / aadhaarNumber       │
│  • bankAccount / accountNumber   │
│  • biometric / fingerprint       │
├─────────────────────────────────┤
│  Result: Found?                  │
│  ✗ YES → Return 400 Error        │
│  ✓ NO  → Continue                │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Validate Required Fields        │
│  • cropType                      │
│  • lossType                      │
│  • lossSeverity                  │
│  • state                         │
├─────────────────────────────────┤
│  Result: All present?            │
│  ✗ NO  → Return 400 Error        │
│  ✓ YES → Continue                │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Validate Enum Values            │
│  • lossType ∈ allowed values?    │
│  • lossSeverity ∈ allowed?       │
│  • landholdingCategory ∈ allowed?│
├─────────────────────────────────┤
│  Result: Valid?                  │
│  ✗ NO  → Return 400 Error        │
│  ✓ YES → Continue                │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Sanitize & Normalize         │
│  • Trim whitespace               │
│  • Convert enums to lowercase    │
│  • Remove null/undefined         │
└──────────┬──────────────────────┘
           │
           ▼
     Process Request
```

---

**Built with deterministic rule-based logic for reliable, transparent recommendations.**
