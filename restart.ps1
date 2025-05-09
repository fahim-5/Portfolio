# Restart script for Portfolio project
Write-Host "Stopping existing processes..." -ForegroundColor Cyan

# Try to stop any running servers
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "Portfolio" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Give processes time to fully terminate
Start-Sleep -Seconds 2

# Start Backend
Write-Host "Starting Backend server..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory ".\backend" -PassThru -WindowStyle Normal

# Wait for backend to initialize
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend server..." -ForegroundColor Green
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory ".\frontend" -PassThru -WindowStyle Normal

Write-Host "Servers are now running!" -ForegroundColor Cyan
Write-Host "Backend running with PID: $($backendProcess.Id)" -ForegroundColor Magenta
Write-Host "Frontend running with PID: $($frontendProcess.Id)" -ForegroundColor Magenta
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep script running to allow for clean termination
try {
    while ($true) {
        Start-Sleep -Seconds 1
        if (-not $backendProcess.HasExited -and -not $frontendProcess.HasExited) {
            # Both processes still running
        } else {
            if ($backendProcess.HasExited) {
                Write-Host "Backend server stopped unexpectedly!" -ForegroundColor Red
            }
            if ($frontendProcess.HasExited) {
                Write-Host "Frontend server stopped unexpectedly!" -ForegroundColor Red
            }
            break
        }
    }
}
finally {
    # Cleanup when script is terminated
    if (-not $backendProcess.HasExited) {
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    if (-not $frontendProcess.HasExited) {
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "All servers stopped." -ForegroundColor Cyan
} 