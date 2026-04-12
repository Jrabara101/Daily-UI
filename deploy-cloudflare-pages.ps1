param(
  [ValidateSet("all", "34", "35", "36", "45")]
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

    if (-not $SkipBuild) {
      Write-Host "Building..."
      npm run build
      if ($LASTEXITCODE -ne 0) {
        throw "Build failed for $($project.Path)"
      }
    }

    if ($PreviewBranch) {
      Write-Host "Deploying preview..."
      npx wrangler pages deploy dist --project-name $($project.Name) --branch $PreviewBranch
    } else {
      Write-Host "Deploying production..."
      npx wrangler pages deploy dist --project-name $($project.Name)
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
