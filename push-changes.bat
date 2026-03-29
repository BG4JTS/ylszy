@echo off

echo 开始推送更改...

:: 检查当前目录是否是git仓库
if not exist ".git" (
    echo 错误: 当前目录不是git仓库!
    pause
    exit /b 1
)

:: 添加所有更改
echo 添加所有更改...
git add .
if %errorlevel% neq 0 (
    echo 错误: git add 命令失败
    pause
    exit /b 1
)

:: 检查是否有更改需要提交
git status --porcelain > changes.txt
if %errorlevel% neq 0 (
    echo 错误: git status 命令失败
    pause
    exit /b 1
)

for %%a in (changes.txt) do if %%~za equ 0 (
    echo 没有更改需要提交
    del changes.txt
    pause
    exit /b 0
)
del changes.txt

:: 提交更改
echo 提交更改...
for /f "tokens=1-3 delims=/ " %%i in ('date /t') do set date=%%k-%%i-%%j
for /f "tokens=1-2 delims=: " %%i in ('time /t') do set time=%%i:%%j
git commit -m "自动提交: %date% %time%"
if %errorlevel% neq 0 (
    echo 错误: git commit 命令失败
    pause
    exit /b 1
)

:: 推送更改
echo 推送更改到远程仓库...
git push origin main
if %errorlevel% neq 0 (
    echo 错误: git push 命令失败
    pause
    exit /b 1
)

echo 推送成功!
pause
