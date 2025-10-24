# bootstrap-project.ps1

Write-Host "Starting project environment setup..."

# --- 1. Check and Install Deno ---
if (-not (Get-Command deno -ErrorAction SilentlyContinue)) {
    Write-Host "Deno not found. Installing Deno..."
    try {
        irm https://deno.land/install.ps1 | iex
        Write-Host "Deno installed successfully."
    } catch {
        Write-Host "Error installing Deno: $($_.Exception.Message)"
        Write-Host "Please ensure you have internet access and try again, or install Deno manually from https://deno.land/#installation"
        exit 1
    }
} else {
    Write-Host "Deno is already installed."
}

# --- 2. Check for Git ---
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git not found. Please install Git from https://git-scm.com/downloads and rerun this script."
    exit 1
} else {
    Write-Host "Git is already installed."
}

# --- 3. Initialize Git Repository ---
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..."
    try {
        git init | Out-Null
        Write-Host "Git repository initialized."
    } catch {
        Write-Host "Error initializing Git repository: $($_.Exception.Message)"
        exit 1
    }
} else {
    Write-Host "Git repository already exists."
}

# --- 4. Configure Gitflow ---
Write-Host "Initializing Gitflow..."
try {
    git flow init -d | Out-Null
    Write-Host "Gitflow initialized with default branches."
} catch {
    Write-Host "Error initializing Gitflow: $($_.Exception.Message)"
    Write-Host "Gitflow might already be initialized or there was an issue. Continuing..."
}

# --- 5. Create Deno/TypeScript Project Structure ---
Write-Host "Creating Deno/TypeScript project structure..."

# Create directories
New-Item -ItemType Directory -Force src | Out-Null
New-Item -ItemType Directory -Force tests | Out-Null

# Create deno.jsonc
Set-Content -Path deno.jsonc -Value @'
{
  "tasks": {
    "dev": "deno run --allow-net --watch src/main.ts",
    "start": "deno run --allow-net src/main.ts",
    "test": "deno test --allow-read --allow-env tests/"
  },
  "compilerOptions": {
    "lib": ["deno.window", "deno.ns"],
    "strict": true
  }
}
'@
Write-Host "Created deno.jsonc"

# Create foundry.jsonc
Set-Content -Path foundry.jsonc -Value @'
{
  "name": "New Project",
  "version": "0.1.0",
  "language": "TypeScript/Deno",
  "description": "A new project scaffolded by The Foundry.",
  "modules": []
}
'@
Write-Host "Created foundry.jsonc"

# Create README.md
Set-Content -Path README.md -Value "# New Project"
Write-Host "Created README.md"

# Create src/main.ts
Set-Content -Path src/main.ts -Value "console.log('Hello from Deno!');"
Write-Host "Created src/main.ts"

# Create tests/main.test.ts
Set-Content -Path tests/main.test.ts -Value @'
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("main function logs hello", () => {
  // This is a placeholder test. Replace with actual tests.
  assertEquals(true, true);
});
'@
Write-Host "Created tests/main.test.ts"

# --- 6. Create .geminiignore ---
Set-Content -Path .geminiignore -Value @'
# Gemini-specific ignores
.gemini/
'@
Write-Host "Created .geminiignore"

# --- 7. Create .gitignore ---
Set-Content -Path .gitignore -Value @'
# Git ignores
.env
.vscode/
node_modules/
dist/
target/
npm-debug.log
yarn-debug.log
yarn-error.log
*.log
*.backup
*.swp
*.swo
*.DS_Store
Thumbs.db
'@
Write-Host "Created .gitignore"

# --- 8. Initial Git Commit ---
Write-Host "Performing initial Git commit..."
try {
    git add . | Out-Null
    git commit -m "feat: Initial project setup with Deno, TypeScript, and Gitflow" | Out-Null
    Write-Host "Initial commit successful."
} catch {
    Write-Host "Error during initial Git commit: $($_.Exception.Message)"
    Write-Host "Please check your Git configuration and commit manually if necessary."
}

Write-Host "Project environment setup complete."