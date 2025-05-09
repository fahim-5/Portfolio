@echo off
echo Starting server with database fixes...
cd /d %~dp0
node scripts/start-with-db-fix.js
pause 