param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ArgsList
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$installer = Join-Path $scriptDir "scripts/install.mjs"
$nodeBin = if ($env:NODE_BIN) { $env:NODE_BIN } else { "node" }

try {
  $null = Get-Command $nodeBin -ErrorAction Stop
} catch {
  Write-Error "Node.js is required but '$nodeBin' was not found in PATH."
  exit 1
}

& $nodeBin $installer @ArgsList
exit $LASTEXITCODE
