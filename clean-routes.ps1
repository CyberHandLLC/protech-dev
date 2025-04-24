# Clean up the routes to eliminate conflicts
Write-Host "Cleaning up routing structure..."

# Remove the .next directory to clear Next.js cache
if (Test-Path .next) {
    Write-Host "Removing .next directory..."
    Remove-Item -Force -Recurse .next
}

# Create backup directory
$backupDir = "src/app/services-backup"
if (-Not (Test-Path $backupDir)) {
    Write-Host "Creating backup directory..."
    New-Item -ItemType Directory -Force -Path $backupDir
}

# Move current services directory to backup
Write-Host "Backing up current services directory..."
Copy-Item -Recurse "src/app/services" $backupDir

# Remove services directory
Write-Host "Removing services directory..."
Remove-Item -Force -Recurse "src/app/services"

# Recreate services directory structure
Write-Host "Recreating services directory structure..."
New-Item -ItemType Directory -Force -Path "src/app/services"
New-Item -ItemType Directory -Force -Path "src/app/services/[category]"
New-Item -ItemType Directory -Force -Path "src/app/services/[category]/[system]"
New-Item -ItemType Directory -Force -Path "src/app/services/[category]/[system]/[serviceType]"
New-Item -ItemType Directory -Force -Path "src/app/services/[category]/[system]/[serviceType]/[item]"
New-Item -ItemType Directory -Force -Path "src/app/services/[category]/[system]/[serviceType]/[item]/[location]"

# Copy the backed up page files
Write-Host "Copying page files from backup..."
Copy-Item -Force "$backupDir/services/page.tsx" "src/app/services/page.tsx"
Copy-Item -Force "$backupDir/services/[category]/[system]/[serviceType]/[item]/[location]/page.tsx" "src/app/services/[category]/[system]/[serviceType]/[item]/[location]/page.tsx"

Write-Host "Route cleanup complete!"