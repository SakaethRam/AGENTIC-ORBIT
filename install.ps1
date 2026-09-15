$ErrorActionPreference = "Stop"

$zipUrl = "https://github.com/SakaethRam/AGENTIC-ORBIT/releases/download/ORBIT-CLI-v.0.12/orbit-cli-windows-v0.1.0.zip"
$installDir = "$env:LOCALAPPDATA\ORBIT\bin"
$tempDir = "$env:TEMP\orbit-cli-install"
$zipPath = "$env:TEMP\orbit-cli-windows-v0.1.0.zip"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "          ORBIT CLI INSTALLER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Clean previous temporary installation
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
New-Item -ItemType Directory -Force -Path $installDir | Out-Null

# Download
Write-Host "Downloading ORBIT CLI..." -ForegroundColor Yellow

Invoke-WebRequest `
    -Uri $zipUrl `
    -OutFile $zipPath

# Extract ZIP to temporary directory
Write-Host "Extracting ORBIT CLI..." -ForegroundColor Yellow

Expand-Archive `
    -Path $zipPath `
    -DestinationPath $tempDir `
    -Force

# Because the ZIP contains:
# orbit-cli-windows/
#     bin/
#     dist/
#     runtime/
$packageDir = Join-Path $tempDir "orbit-cli-windows"

if (-not (Test-Path $packageDir)) {
    throw "ORBIT CLI package directory was not found after extraction."
}

# Verify required files
if (-not (Test-Path "$packageDir\bin\orbit-cli.js")) {
    throw "ORBIT CLI executable was not found."
}

if (-not (Test-Path "$packageDir\dist\index.js")) {
    throw "ORBIT CLI build files were not found."
}

if (-not (Test-Path "$packageDir\runtime\node.exe")) {
    throw "Bundled Node.js runtime was not found."
}

# Copy CLI files directly to installation directory
Write-Host "Installing ORBIT CLI..." -ForegroundColor Yellow

Copy-Item "$packageDir\bin" `
    "$installDir\bin" `
    -Recurse `
    -Force

Copy-Item "$packageDir\dist" `
    "$installDir\dist" `
    -Recurse `
    -Force

Copy-Item "$packageDir\runtime" `
    "$installDir\runtime" `
    -Recurse `
    -Force

Copy-Item "$packageDir\orbit.cmd" `
    "$installDir\orbit.cmd" `
    -Force

# Add installation directory to User PATH
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")

if (-not $userPath) {
    $userPath = ""
}

$pathEntries = $userPath -split ";" | Where-Object { $_ -ne "" }

if ($pathEntries -notcontains $installDir) {

    $newPath = if ($userPath) {
        "$userPath;$installDir"
    } else {
        $installDir
    }

    [Environment]::SetEnvironmentVariable(
        "Path",
        $newPath,
        "User"
    )

    Write-Host "Added ORBIT CLI to your PATH." -ForegroundColor Green
}
else {
    Write-Host "ORBIT CLI is already in PATH." -ForegroundColor Green
}

# Cleanup
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "     ORBIT CLI INSTALLED SUCCESSFULLY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Installation location:" -ForegroundColor Gray
Write-Host "$installDir" -ForegroundColor White

Write-Host ""
Write-Host "Close this terminal and open a new terminal." -ForegroundColor Yellow

Write-Host ""
Write-Host "Then run:" -ForegroundColor Gray
Write-Host "  orbit clone <project-name>" -ForegroundColor Cyan
Write-Host ""