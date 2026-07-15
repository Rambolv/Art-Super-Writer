Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ─── 获取自身目录（兼容 PS1 脚本和编译 EXE） ───
if ($MyInvocation.MyCommand.Source) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Source
} elseif ($PSCommandPath) {
    $scriptDir = Split-Path -Parent $PSCommandPath
} else {
    $scriptDir = Split-Path -Parent ([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName)
}

# ─── 窗口 ───
$form = New-Object System.Windows.Forms.Form
$form.Text = "超逸写手 — 进程管理"
$form.Size = New-Object System.Drawing.Size(400, 300)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.BackColor = "#0d0d1a"
$form.ForeColor = "#e0e0e8"
$form.Font = New-Object System.Drawing.Font("Microsoft YaHei", 10)

# ─── 标题 ───
$title = New-Object System.Windows.Forms.Label
$title.Text = "超逸写手 进程管理"
$title.Font = New-Object System.Drawing.Font("Microsoft YaHei", 18, [System.Drawing.FontStyle]::Bold)
$title.ForeColor = "#00d4ff"
$title.Size = New-Object System.Drawing.Size(360, 40)
$title.Location = New-Object System.Drawing.Point(20, 15)
$title.TextAlign = "MiddleCenter"
$form.Controls.Add($title)

# ─── 后端服务器状态 ───
$lblServer = New-Object System.Windows.Forms.Label
$lblServer.Text = "🔍 检测中..."
$lblServer.Font = New-Object System.Drawing.Font("Microsoft YaHei", 10)
$lblServer.Size = New-Object System.Drawing.Size(170, 28)
$lblServer.Location = New-Object System.Drawing.Point(20, 70)
$lblServer.TextAlign = "MiddleLeft"
$form.Controls.Add($lblServer)

# ─── 关闭后端按钮 ───
$btnKillServer = New-Object System.Windows.Forms.Button
$btnKillServer.Text = "⏹  关闭后端服务"
$btnKillServer.Font = New-Object System.Drawing.Font("Microsoft YaHei", 11, [System.Drawing.FontStyle]::Bold)
$btnKillServer.ForeColor = "White"
$btnKillServer.BackColor = "#e94560"
$btnKillServer.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$btnKillServer.FlatAppearance.BorderSize = 0
$btnKillServer.Size = New-Object System.Drawing.Size(165, 36)
$btnKillServer.Location = New-Object System.Drawing.Point(200, 68)
$form.Controls.Add($btnKillServer)

# ─── 本地LLM状态 ───
$lblLLM = New-Object System.Windows.Forms.Label
$lblLLM.Text = "🔍 检测中..."
$lblLLM.Font = New-Object System.Drawing.Font("Microsoft YaHei", 10)
$lblLLM.Size = New-Object System.Drawing.Size(170, 28)
$lblLLM.Location = New-Object System.Drawing.Point(20, 120)
$lblLLM.TextAlign = "MiddleLeft"
$form.Controls.Add($lblLLM)

# ─── 关闭LLM按钮 ───
$btnKillLLM = New-Object System.Windows.Forms.Button
$btnKillLLM.Text = "🛑  关闭本地LLM"
$btnKillLLM.Font = New-Object System.Drawing.Font("Microsoft YaHei", 11, [System.Drawing.FontStyle]::Bold)
$btnKillLLM.ForeColor = "White"
$btnKillLLM.BackColor = "#e94560"
$btnKillLLM.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$btnKillLLM.FlatAppearance.BorderSize = 0
$btnKillLLM.Size = New-Object System.Drawing.Size(165, 36)
$btnKillLLM.Location = New-Object System.Drawing.Point(200, 118)
$form.Controls.Add($btnKillLLM)

# ─── 日志框 ───
$logBox = New-Object System.Windows.Forms.TextBox
$logBox.Multiline = $true
$logBox.ReadOnly = $true
$logBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$logBox.ForeColor = "#2ed573"
$logBox.BackColor = "#0d0d1a"
$logBox.Size = New-Object System.Drawing.Size(360, 70)
$logBox.Location = New-Object System.Drawing.Point(20, 168)
$logBox.BorderStyle = [System.Windows.Forms.BorderStyle]::FixedSingle
$form.Controls.Add($logBox)

function Write-Log {
    param([string]$msg)
    $logBox.AppendText("$msg`r`n")
    $logBox.SelectionStart = $logBox.TextLength
    $logBox.ScrollToCaret()
}

# ─── 检测服务状态 ───
function Update-Status {
    # 检测后端 (端口 8899)
    $serverOk = $false
    try {
        $conn = Get-NetTCPConnection -LocalPort 8899 -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
        if ($conn) { $serverOk = $true }
    } catch {}
    if ($serverOk) {
        $lblServer.Text = "🟢 后端服务运行中"
        $lblServer.ForeColor = "#2ed573"
        $btnKillServer.Enabled = $true
        $btnKillServer.BackColor = "#e94560"
        $btnKillServer.Text = "⏹  关闭后端服务"
    } else {
        $lblServer.Text = "🔴 后端服务未运行"
        $lblServer.ForeColor = "#8888aa"
        $btnKillServer.Enabled = $false
        $btnKillServer.BackColor = "#555577"
        $btnKillServer.Text = "⏹  已关闭"
    }

    # 检测本地LLM (按目录+常见进程名)
    $llmOk = $false
    $localLlmDir = Join-Path $scriptDir "LLM"
    try {
        # 方法1：按LLM目录查
        $procs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.ExecutablePath -and $_.ExecutablePath -like "$localLlmDir*" }
        if ($procs) { $llmOk = $true }
    } catch {}
    if (-not $llmOk) {
        # 方法2：按常见进程名查
        $llmNames = @("llama-server","llama-cli","llama","koboldcpp","text-generation-launcher","vllm")
        foreach ($name in $llmNames) {
            try { if (Get-Process -Name $name -ErrorAction SilentlyContinue) { $llmOk = $true; break } } catch {}
        }
    }
    # 方法3：检查LLM文件夹是否存在
    $llmFolderExists = Test-Path $localLlmDir
    
    if ($llmOk) {
        $lblLLM.Text = "🟢 本地LLM运行中"
        $lblLLM.ForeColor = "#2ed573"
        $btnKillLLM.Enabled = $true
        $btnKillLLM.BackColor = "#e94560"
        $btnKillLLM.Text = "🛑  关闭本地LLM"
    } elseif ($llmFolderExists) {
        $lblLLM.Text = "🔴 本地LLM未运行"
        $lblLLM.ForeColor = "#8888aa"
        $btnKillLLM.Enabled = $false
        $btnKillLLM.BackColor = "#555577"
        $btnKillLLM.Text = "🛑  已关闭"
    } else {
        $lblLLM.Text = "⚫ 未检测到LLM文件夹"
        $lblLLM.ForeColor = "#555577"
        $btnKillLLM.Enabled = $false
        $btnKillLLM.BackColor = "#555577"
        $btnKillLLM.Text = "🛑  无LLM"
    }
}

# ─── 关闭后端服务 ───
$btnKillServer.Add_Click({
    $btnKillServer.Enabled = $false
    $btnKillServer.Text = "⏳ 正在关闭..."
    $btnKillServer.Refresh()
    $killed = $false
    # 按端口杀 (只杀 LISTEN 状态)
    try {
        $conn = Get-NetTCPConnection -LocalPort 8899 -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' }
        if ($conn) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Log "⏹ 后端服务已关闭 (PID: $($conn.OwningProcess))"
            $killed = $true
        }
    } catch {}
    if (-not $killed) { Write-Log "⚠️ 后端服务未运行" }
    Start-Sleep -Milliseconds 500
    Update-Status
})

# ─── 关闭本地LLM ───
$btnKillLLM.Add_Click({
    $btnKillLLM.Enabled = $false
    $btnKillLLM.Text = "⏳ 正在关闭..."
    $btnKillLLM.Refresh()
    $killed = $false
    $localLlmDir = Join-Path $scriptDir "LLM"
    # 方法1：按LLM目录进程杀
    try {
        $procs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.ExecutablePath -and $_.ExecutablePath -like "$localLlmDir*" }
        foreach ($p in $procs) {
            Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
            Write-Log "🛑 已关闭: $($p.Name) (PID: $($p.ProcessId))"
            $killed = $true
        }
    } catch {}
    # 方法2：按常见进程名杀
    $llmNames = @("llama-server","llama-cli","llama","koboldcpp","text-generation-launcher","vllm")
    foreach ($name in $llmNames) {
        try {
            $procs = Get-Process -Name $name -ErrorAction SilentlyContinue
            foreach ($p in $procs) {
                Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
                Write-Log "🛑 已关闭: $name (PID: $($p.Id))"
                $killed = $true
            }
        } catch {}
    }
    if (-not $killed) { Write-Log "⚠️ 未找到运行中的LLM进程" }
    Start-Sleep -Milliseconds 500
    Update-Status
})

# ─── 刷新按钮 ───
$btnRefresh = New-Object System.Windows.Forms.Button
$btnRefresh.Text = "🔄 刷新状态"
$btnRefresh.Font = New-Object System.Drawing.Font("Microsoft YaHei", 9)
$btnRefresh.ForeColor = "#e0e0e8"
$btnRefresh.BackColor = "#2d2d4a"
$btnRefresh.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$btnRefresh.FlatAppearance.BorderSize = 0
$btnRefresh.Size = New-Object System.Drawing.Size(120, 30)
$btnRefresh.Location = New-Object System.Drawing.Point(260, 245)
$form.Controls.Add($btnRefresh)
$btnRefresh.Add_Click({ Update-Status })

# ─── 初始化 ───
Update-Status
Write-Log "就绪 — 检测到脚本目录: $scriptDir"
$form.ShowDialog() | Out-Null
