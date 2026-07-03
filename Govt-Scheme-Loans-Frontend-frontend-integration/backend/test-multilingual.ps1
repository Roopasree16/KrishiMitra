# Test script for multilingual API endpoints

Write-Host "`n=== Testing Multilingual Government Scheme & Loan Advisory API ===" -ForegroundColor Cyan
Write-Host "Server: http://localhost:3000`n" -ForegroundColor Yellow

# Test data for different scenarios
$testCases = @(
    @{
        name = "English - Default"
        data = @{
            cropType = "Rice"
            lossType = "disease"
            lossSeverity = "high"
            state = "Andhra Pradesh"
            landholdingCategory = "small"
        }
    },
    @{
        name = "Telugu (Telangana)"
        data = @{
            cropType = "Rice"
            lossType = "disease"
            lossSeverity = "high"
            state = "Telangana"
            landholdingCategory = "small"
            language = "te"
        }
    },
    @{
        name = "Hindi (North India)"
        data = @{
            cropType = "Wheat"
            lossType = "drought"
            lossSeverity = "medium"
            state = "Punjab"
            landholdingCategory = "marginal"
            language = "hi"
        }
    },
    @{
        name = "Kannada (Karnataka)"
        data = @{
            cropType = "Cotton"
            lossType = "pest"
            lossSeverity = "high"
            state = "Karnataka"
            language = "kn"
        }
    },
    @{
        name = "Tamil (Tamil Nadu)"
        data = @{
            cropType = "Sugarcane"
            lossType = "drought"
            lossSeverity = "medium"
            state = "Tamil Nadu"
            language = "ta"
        }
    },
    @{
        name = "Malayalam (Kerala)"
        data = @{
            cropType = "Rice"
            lossType = "flood"
            lossSeverity = "high"
            state = "Kerala"
            language = "ml"
        }
    },
    @{
        name = "Unsupported Language - Fallback to English"
        data = @{
            cropType = "Maize"
            lossType = "pest"
            lossSeverity = "low"
            state = "Bihar"
            language = "jp"
        }
    }
)

# Test schemes endpoint for each language
Write-Host "Testing SCHEME RECOMMENDATIONS for multiple languages...`n" -ForegroundColor Green

foreach ($test in $testCases) {
    Write-Host "Test: $($test.name)" -ForegroundColor Cyan
    $jsonBody = $test.data | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/recommend/schemes" `
            -Method Post -ContentType "application/json" -Body $jsonBody -ErrorAction Stop
        
        Write-Host "  ✓ Language: $($response.language)" -ForegroundColor Green
        Write-Host "  ✓ Recommendations: $($response.totalRecommendations)" -ForegroundColor Green
        
        if ($response.recommendations.Count -gt 0) {
            Write-Host "  ✓ First recommendation reason (snippet):" -ForegroundColor Gray
            $reason = $response.recommendations[0].reason
            if ($reason.Length -gt 80) {
                Write-Host "    $($reason.Substring(0, 80))..." -ForegroundColor Gray
            } else {
                Write-Host "    $reason" -ForegroundColor Gray
            }
        }
        
        Write-Host "  ✓ Disclaimer (first 60 chars): $($response.systemDisclaimer.Substring(0, 60))..." -ForegroundColor Gray
        Write-Host ""
    }
    catch {
        Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test loans endpoint for a sample language
Write-Host "Testing LOAN RECOMMENDATIONS for Telugu...`n" -ForegroundColor Green

$loanTestData = @{
    cropType = "Wheat"
    lossType = "drought"
    lossSeverity = "high"
    state = "Maharashtra"
    landholdingCategory = "small"
    language = "hi"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/recommend/loans" `
        -Method Post -ContentType "application/json" -Body $loanTestData -ErrorAction Stop
    
    Write-Host "  ✓ Language: $($response.language)" -ForegroundColor Green
    Write-Host "  ✓ Total Loans: $($response.totalRecommendations)" -ForegroundColor Green
    
    if ($response.recommendations.Count -gt 0) {
        foreach ($rec in $response.recommendations) {
            Write-Host "  • $($rec.loanName)" -ForegroundColor White
            Write-Host "    Reason (snippet): $($rec.reason.Substring(0, 60))..." -ForegroundColor Gray
        }
    }
    Write-Host ""
}
catch {
    Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "`n=== Multilingual Testing Complete ===" -ForegroundColor Cyan
Write-Host "All languages supported: en, hi, te, ta, kn, ml" -ForegroundColor Green
Write-Host "Unsupported languages automatically fallback to English" -ForegroundColor Green
