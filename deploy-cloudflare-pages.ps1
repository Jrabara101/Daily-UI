param(
  [ValidateSet("all", "34", "35", "36", "45", "69", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "90", "91", "92", "93", "94", "95", "99")]
  [string]$Target = "all",

  [string]$PreviewBranch = "",

  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$projects = @(
  @{
    Key = "34"
    Name = "daily-ui-34"
    Path = "Daily UI 34"
  },
  @{
    Key = "35"
    Name = "daily-ui-35"
    Path = "Daily UI 35"
  },
  @{
    Key = "36"
    Name = "daily-ui-36"
    Path = "Daily UI 36"
  },
  @{
    Key = "45"
    Name = "daily-ui-45"
    Path = "Daily UI 45"
  },
  @{
    Key     = "69"
    Name    = "daily-ui-69"
    Path    = "Daily UI 69"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "73"
    Name    = "daily-ui-73"
    Path    = "Daily UI 73"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "74"
    Name    = "daily-ui-74"
    Path    = "Daily UI 74"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "75"
    Name    = "daily-ui-75"
    Path    = "Daily UI 75"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "76"
    Name    = "daily-ui-76"
    Path    = "Daily UI 76"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "77"
    Name    = "daily-ui-77"
    Path    = "Daily UI 77"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "78"
    Name    = "daily-ui-78"
    Path    = "Daily UI 78"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "79"
    Name    = "daily-ui-79"
    Path    = "Daily UI 79"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "80"
    Name    = "daily-ui-80"
    Path    = "Daily UI 80"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "81"
    Name    = "daily-ui-81"
    Path    = "Daily UI 81"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "82"
    Name    = "daily-ui-82"
    Path    = "Daily UI 82"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "83"
    Name    = "daily-ui-83"
    Path    = "Daily UI 83"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "84"
    Name    = "daily-ui-84"
    Path    = "Daily UI 84"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "85"
    Name    = "daily-ui-85"
    Path    = "Daily UI 85"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "90"
    Name    = "daily-ui-90"
    Path    = "Daily UI 90"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "91"
    Name    = "daily-ui-91"
    Path    = "Daily UI 91"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "92"
    Name    = "daily-ui-92"
    Path    = "Daily UI 92"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "93"
    Name    = "daily-ui-93"
    Path    = "Daily UI 93"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "94"
    Name    = "daily-ui-94"
    Path    = "Daily UI 94"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "95"
    Name    = "daily-ui-95"
    Path    = "Daily UI 95"
    Dir     = "."
    NoBuild = $true
  },
  @{
    Key     = "99"
    Name    = "daily-ui-99"
    Path    = "Daily UI 99"
    Dir     = "."
    NoBuild = $true
  }
)

function Assert-Command([string]$CommandName) {
  if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $CommandName. Install Node.js (includes npm/npx) first."
  }
}

Assert-Command "npm"
Assert-Command "npx"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$selected = if ($Target -eq "all") { $projects } else { $projects | Where-Object { $_.Key -eq $Target } }

if (-not $selected -or $selected.Count -eq 0) {
  throw "No project matched target '$Target'."
}

Write-Host "Cloudflare Pages deploy target: $Target"
if ($PreviewBranch) {
  Write-Host "Deploy mode: preview branch '$PreviewBranch'"
} else {
  Write-Host "Deploy mode: production"
}

foreach ($project in $selected) {
  $projectPath = Join-Path $root $project.Path
  if (-not (Test-Path $projectPath)) {
    throw "Project path not found: $projectPath"
  }

  Push-Location $projectPath
  try {
    Write-Host ""
    Write-Host "==> $($project.Path) ($($project.Name))"

    $deployDir = if ($project.ContainsKey('Dir')) { $project.Dir } else { "dist" }
    $doBuild   = -not $SkipBuild -and -not ($project.ContainsKey('NoBuild') -and $project.NoBuild)

    if ($doBuild) {
      Write-Host "Building..."
      npm run build
      if ($LASTEXITCODE -ne 0) {
        throw "Build failed for $($project.Path)"
      }
    }

    if ($PreviewBranch) {
      Write-Host "Deploying preview..."
      npx wrangler pages deploy $deployDir --project-name $($project.Name) --branch $PreviewBranch --commit-dirty=true
    } else {
      Write-Host "Deploying production..."
      npx wrangler pages deploy $deployDir --project-name $($project.Name) --branch main --commit-dirty=true
    }

    if ($LASTEXITCODE -ne 0) {
      throw "Deploy failed for $($project.Path)"
    }
  } finally {
    Pop-Location
  }
}

Write-Host ""
Write-Host "Done. If this is your first deploy on this machine:"
Write-Host "1) Run: npx wrangler login"
Write-Host "2) Create each Pages project once if needed:"
Write-Host "   npx wrangler pages project create daily-ui-34"
Write-Host "   npx wrangler pages project create daily-ui-35"
Write-Host "   npx wrangler pages project create daily-ui-36"
Write-Host "   npx wrangler pages project create daily-ui-45"
Write-Host "   npx wrangler pages project create daily-ui-69"
Write-Host "   npx wrangler pages project create daily-ui-73"
Write-Host "   npx wrangler pages project create daily-ui-74"
Write-Host "   npx wrangler pages project create daily-ui-75"
Write-Host "   npx wrangler pages project create daily-ui-76"
Write-Host "   npx wrangler pages project create daily-ui-77"
Write-Host "   npx wrangler pages project create daily-ui-78"
Write-Host "   npx wrangler pages project create daily-ui-79"
Write-Host "   npx wrangler pages project create daily-ui-80"
Write-Host "   npx wrangler pages project create daily-ui-81"
Write-Host "   npx wrangler pages project create daily-ui-82"
Write-Host "   npx wrangler pages project create daily-ui-83"
Write-Host "   npx wrangler pages project create daily-ui-84"
Write-Host "   npx wrangler pages project create daily-ui-85"
Write-Host "   npx wrangler pages project create daily-ui-90"
Write-Host "   npx wrangler pages project create daily-ui-91"
Write-Host "   npx wrangler pages project create daily-ui-92"
Write-Host "   npx wrangler pages project create daily-ui-93"
Write-Host "   npx wrangler pages project create daily-ui-94"
Write-Host "   npx wrangler pages project create daily-ui-95"
Write-Host "   npx wrangler pages project create daily-ui-99"
