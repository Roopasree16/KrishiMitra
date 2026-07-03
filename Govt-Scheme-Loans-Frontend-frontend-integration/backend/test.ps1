# PowerShell Test Script for Government Scheme & Loan Advisory API

Write-Host "`n=== Testing Government Scheme & Loan Advisory API ===" -ForegroundColor Cyan
Write-Host "Server: http://localhost:3000`n" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "Test 1: Health Check (GET /)" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/" -Method Get -ErrorAction Stop
    Write-Host "Success - Server is running" -ForegroundColor Green
    Write-Host "Version: $($response.version)" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "Error - Server is not responding" -ForegroundColor Red
    Write-Host "Please start the server with: npm start" -ForegroundColor Yellow
    exit
}

# Test 2: Scheme Recommendations
Write-Host "Test 2: Scheme Recommendations (POST /api/recommend/schemes)" -ForegroundColor Green
$schemeData = @{
    cropType = "Rice"
    detectedDisease = "Blast disease"
    lossType = "disease"
    lossSeverity = "high"
    state = "Andhra Pradesh"
    landholdingCategory = "small"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/recommend/schemes" -Method Post -ContentType "application/json" -Body $schemeData -ErrorAction Stop
    Write-Host "Success: $($response.success)" -ForegroundColor Green
    Write-Host "Total Recommendations: $($response.totalRecommendations)" -ForegroundColor White
    Write-Host "`nRecommended Schemes:" -ForegroundColor Cyan
    foreach ($rec in $response.recommendations) {
        Write-Host "  - $($rec.schemeName)" -ForegroundColor White
    }
    Write-Host ""
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Loan Recommendations
Write-Host "Test 3: Loan Recommendations (POST /api/recommend/loans)" -ForegroundColor Green
$loanData = @{
    cropType = "Wheat"
    lossType = "drought"
    lossSeverity = "medium"
    state = "Punjab"
    landholdingCategory = "marginal"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/recommend/loans" -Method Post -ContentType "application/json" -Body $loanData -ErrorAction Stop
    Write-Host "Success: $($response.success)" -ForegroundColor Green
    Write-Host "Total Recommendations: $($response.totalRecommendations)" -ForegroundColor White
    Write-Host "`nRecommended Loans:" -ForegroundColor Cyan
    foreach ($rec in $response.recommendations) {
        Write-Host "  - $($rec.loanName)" -ForegroundColor White
    }
    Write-Host ""
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== All Tests Completed ===" -ForegroundColor Cyan
Write-Host "API is ready for use!`n" -ForegroundColor Green
