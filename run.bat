@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo ==============================================================
echo Starting Swasthya Mitra Core Java and Servlets Engine
echo ==============================================================
echo Compiling source files...
if not exist "target\classes" mkdir "target\classes"
dir /s /b src\main\java\*.java > "%TEMP%\aura_sources.txt"
javac -cp "lib/*;target/classes" -d target/classes @"%TEMP%\aura_sources.txt"
del "%TEMP%\aura_sources.txt" 2>nul
if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b %errorlevel%
)
echo Starting server on http://localhost:8081 ...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
java -cp "target/classes;lib/*" com.aurahealth.server.AuraServer
pause

