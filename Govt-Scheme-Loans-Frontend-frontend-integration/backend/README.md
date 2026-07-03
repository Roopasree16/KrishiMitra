## Government Schemes & Loans Advisory (Backend)

A concise, rule-based Node.js + Express API that recommends relevant government schemes and loan options to farmers based on reported crop loss data, with multilingual responses (en, hi, te, ta, kn, ml). Advisory-only; does not submit applications or store personal data.

### Quick Info
- Install/Run: `npm install` then `npm start` (port 3000)
- Endpoints: `POST /api/recommend/schemes`, `POST /api/recommend/loans`
- Languages: pass `language` in request (`en`, `hi`, `te`, `ta`, `kn`, `ml`)
