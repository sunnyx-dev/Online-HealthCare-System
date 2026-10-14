@echo off
echo ==============================================================
echo 🩺 Starting AuraHealth Core Java & Servlets Engine
echo ==============================================================
echo Compiling source files...
javac -cp "lib/*;target/classes" -d target/classes src/main/java/com/aurahealth/server/AuraServer.java
if %errorlevel% neq 0 (
    echo Compilation failed!
    pause
    exit /b %errorlevel%
)
echo Starting server on http://localhost:8081 ...
java -cp "target/classes;lib/*" com.aurahealth.server.AuraServer
pause
