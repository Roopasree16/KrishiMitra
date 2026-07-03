const express = require('express');
const router = express.Router();
const LoanMatchingEngine = require('../services/loanMatchingEngine');
const Validator = require('../utils/validator');
const { t, getValidLanguage } = require('../utils/translator');

/**
 * Route: POST /api/recommend/loans (mounted at base path /api/recommend)
 * Recommend suitable loan and credit options based on farmer input
 */
router.post('/loans', (req, res) => {
  try {
    // Validate input
    const validation = Validator.validateFarmerInput(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validation.errors
      });
    }
    
    // Sanitize input
    const farmerData = Validator.sanitizeInput(req.body);
    
    // Validate and normalize language
    const language = getValidLanguage(req.body.language || 'en');
    farmerData.language = language;
    
    // Match loans using rule-based engine (defensive default)
    const recommendations = LoanMatchingEngine.matchLoans(farmerData) || [];
    
    // Prepare response
    const response = {
      success: true,
      language: language,
      farmerInput: {
        cropType: farmerData.cropType,
        detectedDisease: farmerData.detectedDisease || 'Not specified',
        lossType: farmerData.lossType,
        lossSeverity: farmerData.lossSeverity,
        state: farmerData.state,
        landholdingCategory: farmerData.landholdingCategory || 'Not specified',
        sanitized: true
      },
      totalRecommendations: recommendations.length,
      recommendations: recommendations,
      systemDisclaimer: t("SYSTEM_DISCLAIMER", language),
      note: t("SYSTEM_NOTE", language),
      moreInfo: t("VISIT_OFFICIAL_PORTAL", language)
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error in /recommend/loans:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
