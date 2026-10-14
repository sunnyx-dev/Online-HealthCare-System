# Swasthya Mitra PowerShell Launch Script
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "Starting Swasthya Mitra Healthcare Engine..." -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Cyan

# 1. Compile Java sources
Write-Host "[1/3] Compiling Java classes..." -ForegroundColor Yellow
if (-not (Test-Path "target\classes")) { 
    New-Item -ItemType Directory -Path "target\classes" -Force | Out-Null 
}

$files = Get-ChildItem -Path "src/main/java" -Recurse -Filter *.java | Select-Object -ExpandProperty FullName
javac -cp "lib/*;target/classes" -d target/classes $files

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Java compilation failed!" -ForegroundColor Red
    pause
    exit $LASTEXITCODE
}

# 2. Check and free port 8081 if occupied
Write-Host "[2/3] Checking port 8081..." -ForegroundColor Yellow
$listeners = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue
if ($listeners) {
    $listeners | ForEach-Object {
        try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
    Start-Sleep -Milliseconds 600
}

# 3. Launch browser
Write-Host "[3/3] Opening web browser..." -ForegroundColor Green
Start-Process "http://localhost:8081/index.html"

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] Server is LIVE on http://localhost:8081" -ForegroundColor Green
Write-Host "Note: Keep this terminal open while using the application." -ForegroundColor White
Write-Host "Press Ctrl + C anytime in this terminal to stop the server." -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# 4. Start Java Server
java -cp "target/classes;lib/*" com.aurahealth.server.AuraServer
