@echo off
echo Pushing to GitHub...

git add .
if %errorlevel% neq 0 (
    echo Failed to add files
    exit /b 1
)

git commit -m "Ready for deployment - Fixed all issues"
if %errorlevel% neq 0 (
    echo Failed to commit
    exit /b 1
)

git push origin master
if %errorlevel% neq 0 (
    echo Failed to push
    exit /b 1
)

echo Successfully pushed to GitHub!
