# Копирует веб-версию в папку Apache и ставит номер сборки в sw.js (чтобы браузер видел обновления).
# Запуск: powershell -ExecutionPolicy Bypass -File tools\local-deploy.ps1 -Target "C:\Apache24\htdocs\game-catalog"
param([Parameter(Mandatory = $true)][string]$Target)
$src = Join-Path $PSScriptRoot '..\www'
New-Item -ItemType Directory -Force -Path $Target | Out-Null
robocopy $src $Target /MIR /NFL /NDL /NJH /NJS | Out-Null
$sw = Join-Path $Target 'sw.js'
$build = Get-Date -Format 'yyyyMMddHHmmss'
$text = [IO.File]::ReadAllText($sw, [Text.Encoding]::UTF8) -replace '__BUILD__', $build
[IO.File]::WriteAllText($sw, $text, (New-Object Text.UTF8Encoding $false))
Write-Host "Готово: $Target (сборка $build)"
