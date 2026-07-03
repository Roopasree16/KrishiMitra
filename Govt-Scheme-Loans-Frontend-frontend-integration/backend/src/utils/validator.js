/**
 * Input validation middleware
 */
class Validator {
  
  /**
   * Validate farmer input for scheme/loan recommendations
   * @param {Object} data - Request body
   * @returns {Object} - Validation result
   */
  static validateFarmerInput(data) {
    const errors = [];
    
    // Required fields
    if (!data.cropType || typeof data.cropType !== 'string' || data.cropType.trim() === '') {
      errors.push('cropType is required');
    }
    
    if (!data.lossType || typeof data.lossType !== 'string' || data.lossType.trim() === '') {
      errors.push('lossType is required');
    } else {
      const validLossTypes = ['disease', 'pest', 'flood', 'drought', 'any'];
      if (!validLossTypes.includes(String(data.lossType).toLowerCase())) {
        errors.push(`lossType must be one of: ${validLossTypes.join(', ')}`);
      }
    }
    
    if (!data.lossSeverity || typeof data.lossSeverity !== 'string' || data.lossSeverity.trim() === '') {
      errors.push('lossSeverity is required');
    } else {
      const validSeverities = ['low', 'medium', 'high'];
      if (!validSeverities.includes(String(data.lossSeverity).toLowerCase())) {
        errors.push(`lossSeverity must be one of: ${validSeverities.join(', ')}`);
      }
    }
    
    if (!data.state || typeof data.state !== 'string' || data.state.trim() === '') {
      errors.push('state is required');
    }
    
    // Optional but validated if provided
    if (data.landholdingCategory) {
      if (typeof data.landholdingCategory !== 'string') {
        errors.push('landholdingCategory must be a string');
      }
      const validCategories = ['small', 'marginal', 'others'];
      if (!validCategories.includes(String(data.landholdingCategory).toLowerCase())) {
        errors.push(`landholdingCategory must be one of: ${validCategories.join(', ')}`);
      }
    }
    
    // Check for restricted data collection
    if (data.aadhaar || data.aadhaarNumber) {
      errors.push('Aadhaar number collection is not permitted');
    }
    
    if (data.bankAccount || data.accountNumber) {
      errors.push('Bank account number collection is not permitted');
    }
    
    if (data.biometric || data.fingerprint || data.iris) {
      errors.push('Biometric data collection is not permitted');
    }

    // Optional fields type safety
    if (typeof data.detectedDisease !== 'undefined' && typeof data.detectedDisease !== 'string') {
      errors.push('detectedDisease must be a string');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Sanitize and normalize farmer input
   * @param {Object} data - Request body
   * @returns {Object} - Sanitized data
   */
  static sanitizeInput(data) {
    return {
      cropType: data.cropType ? String(data.cropType).trim().toLowerCase() : '',
      detectedDisease: data.detectedDisease ? String(data.detectedDisease).trim() : '',
      lossType: data.lossType ? data.lossType.trim().toLowerCase() : '',
      lossSeverity: data.lossSeverity ? data.lossSeverity.trim().toLowerCase() : '',
      state: data.state ? String(data.state).trim().toLowerCase() : '',
      landholdingCategory: data.landholdingCategory ? 
        String(data.landholdingCategory).trim().toLowerCase() : null
    };
  }
}

module.exports = Validator;
