const schemes = require('../data/schemes');
const { t } = require('../utils/translator');

/**
 * Rule-based scheme matching engine
 * Uses IF-ELSE logic to determine eligible schemes based on farmer inputs
 */
class SchemeMatchingEngine {
  /**
   * Helper: return true if field represents universal coverage ('all'/'any') or contains the value
   * Supports string 'all'/'any', array with 'all'/'any', or array containing the value (case-insensitive)
   */
  static includesOrUniversal(field, value) {
    if (!field) return false;
    const toLower = v => String(v).toLowerCase();
    const UNIVERSALS = ["all", "any"];
    if (typeof field === "string") {
      return UNIVERSALS.includes(toLower(field)) || (value ? toLower(field) === toLower(value) : false);
    }
    if (Array.isArray(field)) {
      const lowered = field.map(v => toLower(v));
      if (lowered.some(v => UNIVERSALS.includes(v))) return true;
      return value ? lowered.includes(toLower(value)) : false;
    }
    return false;
  }

  /**
   * Helper: does field indicate universal coverage ('all'/'any')
   */
  static isUniversal(field) {
    if (!field) return false;
    const toLower = v => String(v).toLowerCase();
    const UNIVERSALS = ["all", "any"];
    if (typeof field === "string") return UNIVERSALS.includes(toLower(field));
    return Array.isArray(field) && field.map(v => toLower(v)).some(v => UNIVERSALS.includes(v));
  }

  /**
   * Normalize state
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
    "west bengal": ["wb"]
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
   * Match schemes based on farmer input criteria
   * @param {Object} farmerData - Farmer and crop loss information
   * @returns {Array} - Matched schemes with reasons
   */
  static matchSchemes(farmerData) {
    const {
      cropType,
      detectedDisease,
      lossType,
      lossSeverity,
      state,
      landholdingCategory
    } = farmerData;

    const recommendations = [];

    // Iterate through all schemes and apply rule-based matching
    schemes.forEach(scheme => {
      const matchResult = this.evaluateSchemeEligibility(scheme, farmerData);
      
      if (matchResult.isEligible) {
        recommendations.push({
          schemeName: scheme.name,
          schemeId: scheme.id,
          category: scheme.category,
          reason: matchResult.reason,
          eligibilitySummary: this.generateEligibilitySummary(scheme, farmerData),
          benefits: scheme.benefits,
          requiredDocuments: scheme.requiredDocuments,
          applicationChannel: scheme.applicationChannel,
          officialLink: scheme.officialLink,
          disclaimer: scheme.disclaimer
        });
      }
    });

    return recommendations;
  }

  /**
   * Evaluate if a scheme is eligible based on farmer data
   * @param {Object} scheme - Scheme details
   * @param {Object} farmerData - Farmer information (includes language)
   * @returns {Object} - Eligibility result with reason
   */
  static evaluateSchemeEligibility(scheme, farmerData) {
    const eligibility = scheme.eligibility;
    const reasons = [];
    const lang = farmerData.language || 'en';
    let isEligible = true;

    // Rule 1: Check loss type compatibility
    if (!this.includesOrUniversal(eligibility.lossTypes, farmerData.lossType)) {
      isEligible = false;
    } else {
      if (farmerData.lossType) {
        const typeKey = `COVERS_${farmerData.lossType.toUpperCase()}`;
        reasons.push(t(typeKey, lang));
      }
    }

    // Rule 2: Check loss severity compatibility
    if (!this.includesOrUniversal(eligibility.lossSeverity, farmerData.lossSeverity)) {
      isEligible = false;
    } else {
      if (farmerData.lossSeverity === "high") {
        reasons.push(t("APPLICABLE_HIGH_SEVERITY", lang));
      } else if (farmerData.lossSeverity === "medium") {
        reasons.push(t("APPLICABLE_MEDIUM_SEVERITY", lang));
      } else {
        reasons.push(t("APPLICABLE_ANY_SEVERITY", lang));
      }
    }

    // Rule 3: Check state/region compatibility
    {
      const stateMatch = this.checkStateMatch(eligibility.states, farmerData.state);
      if (!stateMatch) {
        isEligible = false;
      } else {
        if (this.isUniversal(eligibility.states)) {
          reasons.push(t("AVAILABLE_NATIONWIDE", lang));
        } else {
          reasons.push(t("AVAILABLE_IN_STATE", lang, { state: farmerData.state }));
        }
      }
    }

    // Rule 4: Check landholding category (if provided)
    if (farmerData.landholdingCategory) {
      if (!this.includesOrUniversal(eligibility.landholdingCategories, farmerData.landholdingCategory)) {
        isEligible = false;
      } else {
        const categoryKey = `SUITABLE_${farmerData.landholdingCategory.toUpperCase()}`;
        reasons.push(t(categoryKey, lang));
      }
    }

    // Rule 5: Check crop type compatibility
    if (eligibility.cropTypes) {
      if (!this.includesOrUniversal(eligibility.cropTypes, farmerData.cropType)) {
        isEligible = false;
      }
    }

    // Additional reasoning based on scheme category
    if (isEligible) {
      if (scheme.category === "crop_insurance") {
        reasons.push(t("PROVIDES_INSURANCE", lang));
      } else if (scheme.category === "income_support") {
        reasons.push(t("PROVIDES_INCOME_SUPPORT", lang));
      } else if (scheme.category === "advisory") {
        reasons.push(t("PROVIDES_ADVISORY", lang));
      } else if (scheme.category === "state_crop_loss_relief") {
        if (farmerData.lossSeverity === "high" || farmerData.lossSeverity === "medium") {
          reasons.push(t("RECOVERS_FROM_LOSS", lang));
        }
      }
    }

    return {
      isEligible,
      reason: isEligible ? reasons.join(". ") + "." : "Not eligible based on current criteria"
    };
  }

  /**
   * Check if farmer's state matches scheme's state eligibility
   * @param {Array|String} eligibleStates - States where scheme is available
   * @param {String} farmerState - Farmer's state
   * @returns {Boolean} - Whether state matches
   */
  static checkStateMatch(eligibleStates, farmerState) {
    // Handle universal state eligibility
    if (this.isUniversal(eligibleStates)) return true;
    if (!farmerState) return false;

    const farmerForms = this.getStateForms(farmerState);
    const list = Array.isArray(eligibleStates) ? eligibleStates : [eligibleStates];

    for (const s of list) {
      const eligibleForms = this.getStateForms(s);
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
   * @param {Object} scheme - Scheme details
   * @param {Object} farmerData - Farmer information
   * @returns {String} - Eligibility summary
   */
  static generateEligibilitySummary(scheme, farmerData) {
    const parts = [];
    
    if (this.isUniversal(scheme.eligibility.lossTypes)) {
      parts.push("all loss types");
    } else {
      parts.push(`${scheme.eligibility.lossTypes.join(", ")} losses`);
    }

    if (this.isUniversal(scheme.eligibility.states)) {
      parts.push("available nationwide");
    } else {
      parts.push(`available in specific states`);
    }

    if (this.isUniversal(scheme.eligibility.landholdingCategories)) {
      parts.push("all farmer categories");
    } else {
      parts.push(`${scheme.eligibility.landholdingCategories.join(", ")} farmers`);
    }

    return `Eligible for: ${parts.join(", ")}`;
  }
}

module.exports = SchemeMatchingEngine;
