# 自动推送代码的PowerShell脚本

Write-Host "开始推送更改..."

# 检查当前目录是否是git仓库
if (-not (Test-Path ".git")) {
    Write-Host "错误: 当前目录不是git仓库!"
    exit 1
}

# 添加所有更改
try {
    Write-Host "添加所有更改..."
    git add .
    if ($LASTEXITCODE -ne 0) {
        throw "git add 命令失败"
    }
} catch {
    Write-Host "错误: $($_.Exception.Message)"
    exit 1
}

# 检查是否有更改需要提交
try {
    $changes = git status --porcelain
    if ($changes.Length -eq 0) {
        Write-Host "没有更改需要提交"
        exit 0
    }
} catch {
    Write-Host "错误: $($_.Exception.Message)"
    exit 1
}

# 提交更改
try {
    Write-Host "提交更改..."
    $commitMessage = "自动提交: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m "$commitMessage"
    if ($LASTEXITCODE -ne 0) {
        throw "git commit 命令失败"
    }
} catch {
    Write-Host "错误: $($_.Exception.Message)"
    exit 1
}

# 推送更改
try {
    Write-Host "推送更改到远程仓库..."
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        throw "git push 命令失败"
    }
} catch {
    Write-Host "错误: $($_.Exception.Message)"
    exit 1
}

Write-Host "推送成功!"
