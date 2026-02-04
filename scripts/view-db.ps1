# PostgreSQL Database Viewer Script
# This script connects to your local PostgreSQL and shows all data

Write-Host "🗄️  Connecting to PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

# Set password environment variable
$env:PGPASSWORD = "Postgresql144"

# Common PostgreSQL installation paths
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\16\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $psqlPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        break
    }
}

if ($null -eq $psqlPath) {
    Write-Host "❌ psql.exe not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please find your PostgreSQL installation and run:" -ForegroundColor Yellow
    Write-Host '  & "C:\Program Files\PostgreSQL\XX\bin\psql.exe" -U postgres -d neondb' -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or use the Node.js script instead:" -ForegroundColor Green
    Write-Host "  pnpm view:db" -ForegroundColor Green
    exit 1
}

Write-Host "✅ Found psql at: $psqlPath" -ForegroundColor Green
Write-Host ""

# Connect to PostgreSQL and run commands
& $psqlPath -U postgres -d neondb -c "\dt" -c "SELECT * FROM users;" -c "SELECT * FROM customers;" -c "SELECT * FROM invoices;" -c "SELECT * FROM revenue;"

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green

