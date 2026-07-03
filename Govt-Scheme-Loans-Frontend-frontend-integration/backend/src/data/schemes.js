const schemes = [
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "crop_insurance",
    description: "Crop insurance scheme covering notified crops against yield loss due to non-preventable natural risks, with limited post-harvest coverage (up to 14 days)",
    eligibility: {
      lossTypes: ["disease", "pest", "flood", "drought"],
      lossSeverity: ["low", "medium", "high"],
      states: "all",
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all"
    },
    benefits: "Coverage against crop loss due to natural calamities, pests, and diseases. Premium subsidy provided by government.",
    requiredDocuments: [
      "Land ownership documents / Tenancy agreement",
      "Bank account details",
      "Identity proof (as per scheme norms)",
      "Crop sowing certificate",
      "Premium payment receipt"
    ],
    applicationChannel: "Banks / Common Service Centers (CSC) / Insurance companies",
    officialLink: "https://pmfby.gov.in/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "pmkisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "income_support",
    description: "Direct income support of ₹6,000 per year to all farmer families in three equal installments",
    eligibility: {
      lossTypes: ["any"],
      lossSeverity: ["any"],
      states: "all",
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all"
    },
    benefits: "Financial assistance of ₹2,000 every four months directly into farmer's bank account",
    requiredDocuments: [
      "Land ownership documents",
      "Identity proof (as per scheme norms)",
      "Bank account with Aadhaar linkage",
      "Mobile number"
    ],
    applicationChannel: "Online portal / Common Service Centers / Agriculture Department",
    officialLink: "https://pmkisan.gov.in/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "soil_health_card",
    name: "Soil Health Card Scheme",
    category: "advisory",
    description: "Provides soil nutrient status and recommendations for appropriate dosage of nutrients for improved crop productivity",
    eligibility: {
      lossTypes: ["disease", "pest"],
      lossSeverity: ["low", "medium", "high"],
      states: "all",
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all"
    },
    benefits: "Free soil testing and customized fertilizer recommendations to improve soil health and crop yield",
    requiredDocuments: [
      "Land ownership documents",
      "Identity proof (as per scheme norms)",
      "Soil sample from the field"
    ],
    applicationChannel: "Agriculture Department / Soil Testing Laboratories / Krishi Vigyan Kendras",
    officialLink: "https://soilhealth.dac.gov.in/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "state_compensation_andhra",
    name: "Andhra Pradesh Crop Loss Compensation Scheme",
    category: "state_crop_loss_relief",
    description: "State-specific compensation scheme for crop losses due to natural calamities (subject to state government notification and fund availability)",
    eligibility: {
      lossTypes: ["flood", "drought", "pest", "disease"],
      lossSeverity: ["medium", "high"],
      states: ["Andhra Pradesh", "AP"],
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all"
    },
    benefits: "Financial compensation based on extent of crop loss and damaged area",
    requiredDocuments: [
      "Land records",
      "Crop loss assessment certificate from Agriculture Officer",
      "Bank account details",
      "Identity proof"
    ],
    applicationChannel: "Gram Panchayat / Agriculture Department / Online portal",
    officialLink: "https://www.apagrisnet.gov.in/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "state_compensation_punjab",
    name: "Punjab Crop Loss Compensation Scheme",
    category: "state_crop_loss_relief",
    description: "State-level compensation scheme for farmers affected by crop losses (subject to state government notification)",
    eligibility: {
      lossTypes: ["flood", "drought", "pest", "disease"],
      lossSeverity: ["medium", "high"],
      states: ["Punjab", "PB"],
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all"
    },
    benefits: "Direct compensation for verified crop losses",
    requiredDocuments: [
      "Land ownership proof",
      "Damage assessment report",
      "Bank account details",
      "Identity proof (as per scheme norms)"
    ],
    applicationChannel: "Tehsil office / Agriculture Department / Online portal",
    officialLink: "https://www.punjab.gov.in/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "state_compensation_maharashtra",
    name: "Maharashtra Crop Loss Relief Scheme",
    category: "state_crop_loss_relief",
    description: "Financial relief scheme for farmers facing crop losses in Maharashtra (subject to state government guidelines)",
    eligibility: {
      lossTypes: ["flood", "drought", "pest", "disease"],
      lossSeverity: ["medium", "high"],
      states: ["Maharashtra", "MH"],
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all"
    },
    benefits: "State government compensation for crop damage",
    requiredDocuments: [
      "7/12 extract (land records)",
      "Crop loss certificate",
      "Bank passbook",
      "Photo ID"
    ],
    applicationChannel: "Taluka office / Agriculture Department / Aaple Sarkar portal",
    officialLink: "https://krishi.maharashtra.gov.in/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "state_compensation_karnataka",
    name: "Karnataka Natural Calamity Relief Scheme",
    category: "state_crop_loss_relief",
    description: "Compensation scheme for crop losses due to natural disasters in Karnataka (as per state relief norms)",
    eligibility: {
      lossTypes: ["flood", "drought", "pest", "disease"],
      lossSeverity: ["medium", "high"],
      states: ["Karnataka", "KA"],
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all"
    },
    benefits: "Financial assistance for farmers affected by calamities",
    requiredDocuments: [
      "RTC (Record of Rights)",
      "Loss assessment certificate",
      "Bank details",
      "Identity proof (as per scheme norms)"
    ],
    applicationChannel: "Taluk office / Agriculture Department / Seva Sindhu portal",
    officialLink: "https://raitamitra.karnataka.gov.in/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "state_compensation_telangana",
    name: "Telangana Crop Insurance and Relief Scheme",
    category: "state_crop_loss_relief",
    description: "State support scheme for farmers facing crop losses (as per state government announcements)",
    eligibility: {
      lossTypes: ["flood", "drought", "pest", "disease"],
      lossSeverity: ["medium", "high"],
      states: ["Telangana", "TG", "TS"],
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all"
    },
    benefits: "Compensation and relief measures for crop damage",
    requiredDocuments: [
      "Pattadar passbook",
      "Crop damage certificate",
      "Bank account details",
      "Identity proof"
    ],
    applicationChannel: "Mandal office / Agriculture Department / TS Online portal",
    officialLink: "https://agriculture.telangana.gov.in/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  }
];

module.exports = schemes;
