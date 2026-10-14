@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo ==============================================================
echo [1/3] Compiling Swasthya Mitra Core Java Engine...
echo ==============================================================
if not exist "target\classes" mkdir "target\classes"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$files = Get-ChildItem -Path 'src/main/java' -Recurse -Filter *.java | Select-Object -ExpandProperty FullName; javac -cp 'lib/*;target/classes' -d target/classes $files; exit $LASTEXITCODE"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Java compilation failed!
    pause
    exit /b %errorlevel%
)

echo [2/3] Checking port 8081...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$l = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue; if ($l) { $l | ForEach-Object { try { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue } catch {} } }"

echo [3/3] Opening web browser...
start http://localhost:8081/index.html

echo.
echo ==============================================================
echo [SUCCESS] Server is LIVE on http://localhost:8081
echo --------------------------------------------------------------
echo Note: Keep this terminal window open while using the application.
echo To STOP the server, press Ctrl + C in this window.
echo ==============================================================
echo.
java -cp "target/classes;lib/*" com.aurahealth.server.AuraServer
pause
