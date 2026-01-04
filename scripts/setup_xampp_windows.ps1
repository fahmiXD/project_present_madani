<#
Setup XAMPP helper (Windows PowerShell)

USAGE (Run as Administrator):
1. Open PowerShell as Administrator
2. cd to project folder and run: .\scripts\setup_xampp_windows.ps1

This script will:
- Add C:\xampp\php to system PATH (if not present)
- Add hosts entry for project.local -> 127.0.0.1 (if not present)
- Append a VirtualHost entry to Apache httpd-vhosts.conf (backup created)

WARNING: Modifies system files; run only if you understand and have admin rights.
#>

param()

function Add-SystemPath {
    param([string]$NewPath)
    $envPath = [Environment]::GetEnvironmentVariable('Path','Machine')
    if ($envPath -notlike "*${NewPath}*") {
        Write-Output "Adding $NewPath to System PATH..."
        $new = "$envPath;${NewPath}"
        [Environment]::SetEnvironmentVariable('Path',$new,'Machine')
        Write-Output "Added. Please restart your terminals to see changes."
    } else {
        Write-Output "Path already contains $NewPath"
    }
}

function Add-HostsEntry {
    param([string]$HostName, [string]$IP)
    $hostsFile = "$env:SystemRoot\System32\drivers\etc\hosts"
    $hosts = Get-Content $hostsFile -ErrorAction Stop
    if ($hosts -notmatch "\b$HostName\b") {
        Write-Output "Adding hosts entry: $IP $HostName"
        Add-Content -Path $hostsFile -Value "`n$IP`t$HostName`
"
    } else {
        Write-Output "Hosts already contains $HostName"
    }
}

function Add-VirtualHost {
    param([string]$ProjectPath, [string]$ServerName)
    $vhosts = "C:\xampp\apache\conf\extra\httpd-vhosts.conf"
    if (-Not (Test-Path $vhosts)) { Write-Output "httpd-vhosts.conf not found at $vhosts"; return }
    $backup = "$vhosts.bak.$((Get-Date).ToString('yyyyMMddHHmmss'))"
    Copy-Item $vhosts $backup -Force
    $entry = @"
<VirtualHost *:80>
    DocumentRoot `"$ProjectPath`"
    ServerName $ServerName
    <Directory `"$ProjectPath`">
        Require all granted
        AllowOverride All
    </Directory>
</VirtualHost>
"@
    if ((Get-Content $vhosts) -notmatch [regex]::Escape($ServerName)) {
        Add-Content -Path $vhosts -Value "`n$entry`n"
        Write-Output "Appended VirtualHost for $ServerName to $vhosts (backup at $backup)"
    } else {
        Write-Output "VirtualHost for $ServerName already appears in $vhosts"
    }
}

# Main
if (-not ([bool]([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))) {
    Write-Error "Script must be run as Administrator."
    exit 1
}

$projectPath = "D:\Project Present Madani"
$phpPath = "C:\xampp\php"
$serverName = "project.local"

Add-SystemPath -NewPath $phpPath
Add-HostsEntry -HostName $serverName -IP "127.0.0.1"
Add-VirtualHost -ProjectPath $projectPath -ServerName $serverName

Write-Output "Done. Restart Apache from XAMPP Control Panel and test http://$serverName/"
