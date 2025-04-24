@echo off
echo Cleaning up routing structure...

rem Delete the .next build directory
if exist .next (
  echo Removing .next directory...
  rmdir /s /q .next
)

rem Remove the old services route structure
echo Removing old route structure...
rmdir /s /q "src\app\services\[category]"

rem We'll keep the services2 structure and the redirect
echo Route cleanup complete!