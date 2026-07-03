const loans = [
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    category: "credit_facility",
    description: "Credit facility for farmers to meet short-term credit requirements for cultivation and post-harvest expenses",
    eligibility: {
      lossTypes: ["disease", "pest", "flood", "drought"],
      lossSeverity: ["low", "medium", "high"],
      states: "all",
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all",
      additionalCriteria: "Farmers and tenant farmers, sharecroppers, and oral lessees"
    },
    benefits: "Flexible credit limit, simple documentation, low interest rates (4-7% with subsidy), insurance coverage",
    interestRate: "4% per annum (with interest subvention up to ₹3 lakh)",
    loanAmount: "Based on scale of finance and cropping pattern",
    repaymentPeriod: "Up to 5 years with yearly renewal",
    requiredDocuments: [
      "Land ownership documents / Tenancy certificate",
      "Identity proof (as per bank norms)",
      "Address proof",
      "Recent passport-size photographs",
      "Bank account details"
    ],
    applicationChannel: "Commercial Banks / Regional Rural Banks / Cooperative Banks",
    officialLink: "https://www.nabard.org/content1.aspx?id=570&catid=8&mid=530",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "miss",
    name: "Modified Interest Subvention Scheme (MISS)",
    category: "interest_subsidy",
    description: "Interest subvention of 1.5% to 2% for farmers who repay short-term crop loans on time",
    eligibility: {
      lossTypes: ["disease", "pest", "flood", "drought"],
      lossSeverity: ["low", "medium", "high"],
      states: "all",
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all",
      additionalCriteria: "Farmers availing short-term crop loans from banks"
    },
    benefits: "Interest rate reduced to 4% per annum for loans up to ₹3 lakh. Additional 3% interest subvention on prompt repayment",
    interestRate: "Effective interest rate up to 4% per annum on timely repayment (for loans up to ₹3 lakh)",
    loanAmount: "Up to ₹3 lakh",
    repaymentPeriod: "Short-term (within one year)",
    requiredDocuments: [
      "KCC or agricultural loan account",
      "Land documents",
      "Identity proof (as per bank norms)",
      "Bank account details"
    ],
    applicationChannel: "Banks (through existing KCC or crop loan account)",
    officialLink: "https://agricoop.nic.in/en/Interest",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  },
  {
    id: "agriculture_term_loan",
    name: "Government-backed Agriculture Term Loan (Advisory Category)",
    category: "recovery_loan",
    description: "Bank-dependent medium to long-term loans for farmers to purchase farm equipment, irrigation systems, or recover from major losses. Availability and terms depend on individual banks",
    eligibility: {
      lossTypes: ["flood", "drought", "disease", "pest"],
      lossSeverity: ["medium", "high"],
      states: "all",
      landholdingCategories: ["small", "marginal", "others"],
      cropTypes: "all",
      additionalCriteria: "Farmers with substantial crop loss requiring capital investment"
    },
    benefits: "Lower interest rates for agriculture sector, flexible repayment schedule, government subsidies on certain equipment",
    interestRate: "7-9% per annum (varies by bank and scheme)",
    loanAmount: "₹50,000 to ₹25 lakh (based on requirement)",
    repaymentPeriod: "3 to 7 years with moratorium period",
    requiredDocuments: [
      "Land ownership proof",
      "Project report / Purchase quotation",
      "Income proof / previous loan history",
      "Identity and address proof (as per bank norms)",
      "Crop loss certificate (if applicable)"
    ],
    applicationChannel: "Nationalized Banks / Regional Rural Banks / Cooperative Banks",
    officialLink: "https://www.nabard.org/",
    disclaimer: "Final eligibility and approval depend on government authorities and financial institutions."
  }
];

module.exports = loans;
