# Start backend and frontend servers
Write-Host "Starting backend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\backend; npm start"

Write-Host "Starting frontend server..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\frontend; npm run dev"

Write-Host "Both servers are now running!"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:3000" 