const loans = require('../data/loans');
const { t } = require('../utils/translator');

/**
 * Rule-based loan matching engine
 * Uses IF-ELSE logic to determine suitable loan options
 */
class LoanMatchingEngine {
  /**
   * Helper: return true if field represents 'all' or contains the value
   * Supports string 'all', array with 'all', or array containing the value
   */
  static includesOrAll(field, value) {
    if (!field) return false;
    if (field === "all") return true;
    if (Array.isArray(field)) {
      const lowerVal = value ? String(value).toLowerCase() : value;
      return field.map(v => String(v).toLowerCase()).includes("all") ||
             (lowerVal ? field.map(v => String(v).toLowerCase()).includes(lowerVal) : false);
    }
    return false;
  }

  /**
   * Helper: check if a field is 'all' (string or array containing 'all')
   */
  static isAll(field) {
    if (!field) return false;
    if (field === "all") return true;
    return Array.isArray(field) && field.map(v => String(v).toLowerCase()).includes("all");
  }

  /**
   * Normalize state string
   */
  static normalizeState(str) {
    return String(str || "").trim().toLowerCase();
  }

  /**
   * Common aliases for Indian states (two-letter codes etc.)
   */
  static STATE_ALIASES = {
    "andhra pradesh": ["ap"],
    "punjab": ["pb"],
    "maharashtra": ["mh"],
    "karnataka": ["ka"],
    "telangana": ["tg", "ts"],
    "uttar pradesh": ["up"],
    "madhya pradesh": ["mp"],
    "tamil nadu": ["tn"],
    "gujarat": ["gj"],
    "rajasthan": ["rj"],
    "bihar": ["br"],
    "kerala": ["kl"],
    "haryana": ["hr"],
    "west bengal": ["wb"],
  };

  /**
   * Get alias forms for a state
   */
  static getStateForms(stateStr) {
    const norm = this.normalizeState(stateStr);
    const aliases = this.STATE_ALIASES[norm] || [];
    return [norm, ...aliases];
  }
  
  /**
   * Match loans based on farmer input criteria
   * @param {Object} farmerData - Farmer and crop loss information
   * @returns {Array} - Matched loans with reasons
   */
  static matchLoans(farmerData) {
    const {
      cropType,
      detectedDisease,
      lossType,
      lossSeverity,
      state,
      landholdingCategory
    } = farmerData;

    const recommendations = [];

    // Iterate through all loan options and apply rule-based matching
    loans.forEach(loan => {
      const matchResult = this.evaluateLoanEligibility(loan, farmerData);
      
      if (matchResult.isEligible) {
        recommendations.push({
          loanName: loan.name,
          loanId: loan.id,
          category: loan.category,
          reason: matchResult.reason,
          eligibilitySummary: this.generateEligibilitySummary(loan, farmerData),
          benefits: loan.benefits,
          interestRate: loan.interestRate,
          loanAmount: loan.loanAmount,
          repaymentPeriod: loan.repaymentPeriod,
          requiredDocuments: loan.requiredDocuments,
          applicationChannel: loan.applicationChannel,
          officialLink: loan.officialLink,
          disclaimer: loan.disclaimer
        });
      }
    });

    return recommendations;
  }

  /**
   * Evaluate if a loan is suitable based on farmer data
   * @param {Object} loan - Loan details
   * @param {Object} farmerData - Farmer information (includes language)
   * @returns {Object} - Eligibility result with reason
   */
  static evaluateLoanEligibility(loan, farmerData) {
    const eligibility = loan.eligibility;
    const reasons = [];
    const lang = farmerData.language || 'en';
    let isEligible = true;

    // Rule 1: Check loss type compatibility
    if (!this.includesOrAll(eligibility.lossTypes, farmerData.lossType)) {
      isEligible = false;
    } else {
      if (farmerData.lossType) {
        reasons.push(`Suitable for ${farmerData.lossType} recovery`);
      }
    }

    // Rule 2: Check loss severity and recommend accordingly
    if (!this.includesOrAll(eligibility.lossSeverity, farmerData.lossSeverity)) {
      isEligible = false;
    } else {
      // Specific recommendations based on severity and loan type
      if (loan.category === "credit_facility") {
        reasons.push(t("QUICK_ACCESS", lang));
      } else if (loan.category === "recovery_loan") {
        reasons.push(t("SUITABLE_FOR_RECOVERY", lang));
      } else if (loan.category === "interest_subsidy") {
        reasons.push(t("LOW_INTEREST", lang));
      }
    }

    // Rule 3: Check state/region compatibility
    {
      const stateMatch = this.checkStateMatch(eligibility.states, farmerData.state);
      if (!stateMatch) {
        isEligible = false;
      } else {
        if (this.isAll(eligibility.states)) {
          reasons.push(t("AVAILABLE_NATIONWIDE", lang));
        } else {
          reasons.push(t("AVAILABLE_IN_STATE", lang, { state: farmerData.state }));
        }
      }
    }

    // Rule 4: Check landholding category
    if (farmerData.landholdingCategory) {
      if (!this.includesOrAll(eligibility.landholdingCategories, farmerData.landholdingCategory)) {
        isEligible = false;
      } else {
        if (farmerData.landholdingCategory === "small" || 
            farmerData.landholdingCategory === "marginal") {
          reasons.push(t("PRIORITY_LENDING", lang));
        }
      }
    }

    // Rule 5: Crop type compatibility (if specified in eligibility)
    if (loan.eligibility && loan.eligibility.cropTypes) {
      if (!this.includesOrAll(loan.eligibility.cropTypes, farmerData.cropType)) {
        isEligible = false;
      }
    }

    // Rule 6: Additional criteria based on loan type
    if (isEligible && loan.id === "kcc") {
      reasons.push(t("FLEXIBLE_CREDIT", lang));
    } else if (isEligible && loan.id === "miss") {
      reasons.push(t("MISS_ADVISORY", lang));
    } else if (isEligible && loan.id === "agriculture_term_loan") {
      reasons.push(t("AGTL_ADVISORY", lang));
    }

    return {
      isEligible,
      reason: isEligible ? reasons.join(". ") + "." : "Not suitable based on current criteria"
    };
  }

  /**
   * Check if farmer's state matches loan's state eligibility
   * @param {Array|String} eligibleStates - States where loan is available
   * @param {String} farmerState - Farmer's state
   * @returns {Boolean} - Whether state matches
   */
  static checkStateMatch(eligibleStates, farmerState) {
    // Handle 'all' and missing inputs
    if (this.isAll(eligibleStates)) return true;
    if (!farmerState) return false;

    const farmerForms = this.getStateForms(farmerState);

    const list = Array.isArray(eligibleStates) ? eligibleStates : [eligibleStates];
    for (const s of list) {
      const eligibleForms = this.getStateForms(s);
      // Exact match or alias match
      for (const f of farmerForms) {
        for (const e of eligibleForms) {
          const fn = this.normalizeState(f);
          const en = this.normalizeState(e);
          if (fn === en || fn.includes(en) || en.includes(fn)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Generate human-readable eligibility summary
   * @param {Object} loan - Loan details
   * @param {Object} farmerData - Farmer information
   * @returns {String} - Eligibility summary
   */
  static generateEligibilitySummary(loan, farmerData) {
    const parts = [];
    
    parts.push(`Interest rate: ${loan.interestRate}`);
    parts.push(`Loan amount: ${loan.loanAmount}`);
    parts.push(`Repayment: ${loan.repaymentPeriod}`);

    return parts.join(" | ");
  }
}

module.exports = LoanMatchingEngine;
