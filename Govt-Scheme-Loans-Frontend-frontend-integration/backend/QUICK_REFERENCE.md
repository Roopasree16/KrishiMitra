# Quick Reference Guide

## 🚀 Start the Server
```bash
npm start
```
Server: http://localhost:3000

---

## 📡 API Endpoints

### 1. Get Scheme Recommendations
```bash
POST http://localhost:3000/api/recommend/schemes
```

**Example Request:**
```json
{
  "cropType": "Rice",
  "lossType": "disease",
  "lossSeverity": "high",
  "state": "Andhra Pradesh"
}
```

### 2. Get Loan Recommendations
```bash
POST http://localhost:3000/api/recommend/loans
```

**Example Request:**
```json
{
  "cropType": "Wheat",
  "lossType": "drought",
  "lossSeverity": "medium",
  "state": "Punjab"
}
```

---

## 📥 Input Parameters

| Parameter | Required | Values |
|-----------|----------|--------|
| `cropType` | ✅ Yes | Any crop name (string) |
| `lossType` | ✅ Yes | `disease`, `pest`, `flood`, `drought` |
| `lossSeverity` | ✅ Yes | `low`, `medium`, `high` |
| `state` | ✅ Yes | State name (string) |
| `detectedDisease` | ❌ No | Disease name (string) |
| `landholdingCategory` | ❌ No | `small`, `marginal`, `others` |

---

## 🧪 Run Tests
```bash
.\test.ps1
```

---

## 📦 Available Schemes

1. **PMFBY** - Pradhan Mantri Fasal Bima Yojana (Crop Insurance)
2. **PM-KISAN** - Direct Income Support (₹6,000/year)
3. **Soil Health Card** - Soil testing & advisory
4. **State Schemes** - Andhra Pradesh, Punjab, Maharashtra, Karnataka, Telangana

---

## 💰 Available Loans

1. **KCC** - Kisan Credit Card (4% interest with subsidy)
2. **MISS** - Modified Interest Subvention Scheme (Additional 3% subsidy)
3. **Term Loan** - Long-term recovery loans (7-9% interest)

---

## 🛡️ Restricted Data

❌ **NEVER COLLECT:**
- Aadhaar numbers
- Bank account numbers
- Biometric data
- Personal identifiers

---

## 📞 Quick Test Commands

### Test Schemes (cURL)
```bash
curl -X POST http://localhost:3000/api/recommend/schemes -H "Content-Type: application/json" -d "{\"cropType\":\"Rice\",\"lossType\":\"disease\",\"lossSeverity\":\"high\",\"state\":\"Karnataka\"}"
```

### Test Loans (PowerShell)
```powershell
$body = @{cropType="Wheat";lossType="flood";lossSeverity="medium";state="Punjab"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/recommend/loans" -Method Post -ContentType "application/json" -Body $body
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `src/server.js` | Main server |
| `src/data/schemes.js` | Scheme database |
| `src/data/loans.js` | Loan database |
| `src/services/schemeMatchingEngine.js` | Scheme matching logic |
| `src/services/loanMatchingEngine.js` | Loan matching logic |
| `src/utils/validator.js` | Input validation |
| `README.md` | Full documentation |

---

## ⚡ Common Tasks

### Add a New Scheme
1. Edit `src/data/schemes.js`
2. Add scheme object with eligibility rules
3. Restart server

### Add a New State
1. Edit `src/data/schemes.js`
2. Add state-specific scheme entry
3. Update state matching logic if needed

### Modify Matching Rules
1. Edit `src/services/schemeMatchingEngine.js` or `loanMatchingEngine.js`
2. Update `evaluateSchemeEligibility()` or `evaluateLoanEligibility()` method
3. Test with various inputs

---

## 🐛 Troubleshooting

**Server won't start:**
- Check if port 3000 is available
- Run `npm install` first

**No recommendations returned:**
- Check if state name matches exactly
- Verify lossType and lossSeverity values
- Check logs in terminal

**Validation errors:**
- Ensure all required fields are provided
- Check spelling of enum values (lowercase)
- Remove any restricted fields (aadhaar, bankAccount)

---

## ✅ Success Checklist

- [x] Server running on port 3000
- [x] Health check returns API info
- [x] Scheme endpoint returns recommendations
- [x] Loan endpoint returns recommendations
- [x] Input validation working
- [x] Disclaimers included in responses
- [x] No personal data collection

---

**Need more help?** See [README.md](README.md) or [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
