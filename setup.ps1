# Quick Start Script for AI Personal Tutor

Write-Host "🎓 AI Personal Tutor - Quick Start Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "`n⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created!" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Edit .env file and add your:" -ForegroundColor Red
    Write-Host "   - MongoDB URI" -ForegroundColor Red
    Write-Host "   - OpenAI API Key" -ForegroundColor Red
    Write-Host "   - JWT Secret" -ForegroundColor Red
    Write-Host "`nPress any key after updating .env file..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
Set-Location ..

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`n🚀 To start the application:" -ForegroundColor Cyan
Write-Host "   Backend:  npm run dev" -ForegroundColor White
Write-Host "   Frontend: cd frontend ; npm start" -ForegroundColor White
Write-Host "   Or Both:  npm run dev:full" -ForegroundColor White
Write-Host "`n📖 For detailed instructions, see SETUP_GUIDE.md" -ForegroundColor Cyan
