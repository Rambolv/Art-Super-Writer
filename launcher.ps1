Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ─── 获取脚本目录（兼容 ps2exe 编译后的 EXE） ───
$scriptDir = [System.IO.Path]::GetDirectoryName([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)

# ─── 本地 LLM 检测（与启动器同级的 LLM 文件夹） ───
$localLlmDir = [System.IO.Path]::Combine($scriptDir, "LLM")
$llmExists = (Test-Path $localLlmDir)

# ─── 查找 start.bat ───
$llmStartBat = ""
if ($llmExists) {
    $found = Get-ChildItem -Path $localLlmDir -Recurse -Filter "start.bat" -Depth 3 -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) { $llmStartBat = $found.FullName }
}

# ─── 主窗口 ───
$form = New-Object System.Windows.Forms.Form
$form.Text = "超逸写手 — 启动器"
$form.Size = New-Object System.Drawing.Size(460, 340)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.Icon = $null
$form.BackColor = "#0d0d1a"

# ─── 标题 ───
$title = New-Object System.Windows.Forms.Label
$title.Text = "超逸写手"
$title.Font = New-Object System.Drawing.Font("Microsoft YaHei", 22, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = "#00d4ff"
$title.Size = New-Object System.Drawing.Size(420, 50)
$title.Location = New-Object System.Drawing.Point(20, 20)
$title.TextAlign = "MiddleCenter"
$form.Controls.Add($title)

# ─── 副标题 ───
$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = "Art Super Writer"
$subtitle.Font = New-Object System.Drawing.Font("Microsoft YaHei", 11)
$subtitle.ForeColor = "#8888aa"
$subtitle.Size = New-Object System.Drawing.Size(420, 25)
$subtitle.Location = New-Object System.Drawing.Point(20, 70)
$subtitle.TextAlign = "MiddleCenter"
$form.Controls.Add($subtitle)

# ─── 启动项面板 ───
$panel = New-Object System.Windows.Forms.Panel
$panel.Size = New-Object System.Drawing.Size(420, 120)
$panel.Location = New-Object System.Drawing.Point(20, 105)
$panel.BackColor = "#14142a"

# 服务器
$cbServer = New-Object System.Windows.Forms.CheckBox
$cbServer.Text = "启动后端服务器 (server.py)"
$cbServer.Font = New-Object System.Drawing.Font("Microsoft YaHei", 11)
$cbServer.ForeColor = "#e0e0e8"
$cbServer.Size = New-Object System.Drawing.Size(380, 28)
$cbServer.Location = New-Object System.Drawing.Point(15, 10)
$cbServer.Checked = $true
$cbServer.Enabled = $true
$panel.Controls.Add($cbServer)

# 主页
$cbHome = New-Object System.Windows.Forms.CheckBox
$cbHome.Text = "打开主页 (index.html)"
$cbHome.Font = New-Object System.Drawing.Font("Microsoft YaHei", 11)
$cbHome.ForeColor = "#e0e0e8"
$cbHome.Size = New-Object System.Drawing.Size(380, 28)
$cbHome.Location = New-Object System.Drawing.Point(15, 45)
$cbHome.Checked = $true
$cbHome.Enabled = $true
$panel.Controls.Add($cbHome)

# 本地 LLM
$cbLLM = New-Object System.Windows.Forms.CheckBox
$cbLLM.Text = "启动本地 LLM"
$cbLLM.Font = New-Object System.Drawing.Font("Microsoft YaHei", 11)
$cbLLM.Size = New-Object System.Drawing.Size(380, 28)
$cbLLM.Location = New-Object System.Drawing.Point(15, 80)

if ($llmExists) {
    $cbLLM.Checked = $true
    $cbLLM.Enabled = $true
    $cbLLM.ForeColor = "#e0e0e8"
} else {
    $cbLLM.Checked = $false
    $cbLLM.Enabled = $false
    $cbLLM.ForeColor = "#555577"
    $cbLLM.Text = "启动本地 LLM (未检测到 LLM 文件夹)"
}
$panel.Controls.Add($cbLLM)

$form.Controls.Add($panel)

# ─── 状态标签 ───
$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = "就绪"
$statusLabel.Font = New-Object System.Drawing.Font("Microsoft YaHei", 9)
$statusLabel.ForeColor = "#8888aa"
$statusLabel.Size = New-Object System.Drawing.Size(420, 22)
$statusLabel.Location = New-Object System.Drawing.Point(20, 235)
$statusLabel.TextAlign = "MiddleLeft"
$form.Controls.Add($statusLabel)

# ─── 启动按钮 ───
$btnStart = New-Object System.Windows.Forms.Button
$btnStart.Text = "🚀  一键启动"
$btnStart.Font = New-Object System.Drawing.Font("Microsoft YaHei", 13, [System.Drawing.FontStyle]::Bold)
$btnStart.ForeColor = "White"
$btnStart.BackColor = "#00d4ff"
$btnStart.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$btnStart.FlatAppearance.BorderSize = 0
$btnStart.Size = New-Object System.Drawing.Size(200, 42)
$btnStart.Location = New-Object System.Drawing.Point(130, 262)
$form.Controls.Add($btnStart)

# ─── 日志框（启动后显示） ───
$logBox = New-Object System.Windows.Forms.TextBox
$logBox.Multiline = $true
$logBox.ReadOnly = $true
$logBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$logBox.ForeColor = "#2ed573"
$logBox.BackColor = "#0d0d1a"
$logBox.Size = New-Object System.Drawing.Size(420, 100)
$logBox.Location = New-Object System.Drawing.Point(20, 105)
$logBox.Visible = $false
$logBox.BorderStyle = [System.Windows.Forms.BorderStyle]::FixedSingle
$form.Controls.Add($logBox)

# ─── 日志函数 ───
function Write-Log {
    param([string]$msg)
    $logBox.AppendText("$msg`r`n")
    $logBox.SelectionStart = $logBox.TextLength
    $logBox.ScrollToCaret()
    $statusLabel.Text = $msg
    $statusLabel.Refresh()
}

# ─── 启动逻辑 ───
$btnStart.Add_Click({
    $btnStart.Enabled = $false
    $statusLabel.Text = "启动中..."
    
    # 切换到日志模式
    $panel.Visible = $false
    $logBox.Visible = $true
    $form.Height = 420
    $btnStart.Location = New-Object System.Drawing.Point(130, 340)
    $statusLabel.Location = New-Object System.Drawing.Point(20, 315)
    
    try {
        # 1. 启动服务器
        if ($cbServer.Checked) {
            Write-Log "🔄 启动后端服务器..."
            $serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$scriptDir`" && .venv\Scripts\python server.py" -WindowStyle Hidden -PassThru
            Write-Log "✅ 后端服务器已启动 (PID: $($serverProcess.Id))"
            Start-Sleep -Seconds 2
        }

        # 2. 启动本地 LLM
        if ($cbLLM.Checked -and $llmExists -and $llmStartBat) {
            Write-Log "🔄 启动本地 LLM..."
            Start-Process -FilePath $llmStartBat -WindowStyle Normal
            Write-Log "✅ 本地 LLM 已启动"
        }

        # 3. 打开主页
        if ($cbHome.Checked) {
            Write-Log "🔄 打开主页..."
            $indexPath = [System.IO.Path]::Combine($scriptDir, "index.html")
            Start-Process "msedge.exe" -ArgumentList "`"file:///$indexPath`"" -ErrorAction SilentlyContinue
            if (-not $?) {
                Start-Process "chrome.exe" -ArgumentList "`"file:///$indexPath`"" -ErrorAction SilentlyContinue
            }
            if (-not $?) {
                Start-Process "file:///$indexPath"
            }
            Write-Log "✅ 主页已打开"
        }

        Write-Log ""
        Write-Log "🎉 启动完成！"
        $statusLabel.Text = "✅ 启动完成"
        $statusLabel.ForeColor = "#2ed573"
        $btnStart.Text = "✅ 完成"
    }
    catch {
        Write-Log "❌ 启动失败: $_"
        $statusLabel.Text = "❌ 启动失败"
        $statusLabel.ForeColor = "#e94560"
        $btnStart.Enabled = $true
    }
})

# ─── 显示窗口 ───
$form.ShowDialog() | Out-Null
