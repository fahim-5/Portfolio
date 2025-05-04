# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js version $nodeVersion is installed"
} catch {
    Write-Host "Error: Node.js is not installed. Please install Node.js before running this script."
    exit 1
}

# Check if npm dependencies are installed
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "Installing npm dependencies..."
    npm install
} else {
    Write-Host "Dependencies already installed. Proceeding with setup..."
}

# Run the setup-db script
Write-Host "Running database setup script..."
node setup-db.js

# Check the exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host "Database setup completed successfully!"
} else {
    Write-Host "Database setup failed. Please check the error messages above."
}

# Pause to keep the window open
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 