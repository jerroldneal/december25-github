# Setup script for Project Sam environment

Write-Host "Initializing Project Sam Environment..." -ForegroundColor Cyan

# 1. Create Temporary Directory
$tempPath = "C:\temp"
if (-not (Test-Path $tempPath)) {
    Write-Host "Creating temporary directory at $tempPath..."
    New-Item -ItemType Directory -Path $tempPath | Out-Null
    Write-Host "Directory created." -ForegroundColor Green
} else {
    Write-Host "Temporary directory $tempPath already exists." -ForegroundColor Green
}

# 2. Check TTS Service
Write-Host "Checking Edge TTS Service on port 3006..."
try {
    $connection = Test-NetConnection -ComputerName localhost -Port 3006 -ErrorAction Stop
    if ($connection.TcpTestSucceeded) {
        Write-Host "Service is RUNNING." -ForegroundColor Green
    } else {
        Write-Host "Service is NOT RUNNING." -ForegroundColor Red
        Write-Host "Please ensure the Edge TTS Docker container and Node.js service are started." -ForegroundColor Yellow
        Write-Host "Reference: jerroldneal/edge-docker" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to check service: $_" -ForegroundColor Red
}

Write-Host "Setup check complete." -ForegroundColor Cyan
