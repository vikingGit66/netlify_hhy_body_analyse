// 添加初始日志（如果为空）
if (logs.length === 0) {
  addLogEntry('INFO', '日志系统已初始化', 'system');
  addLogEntry('SUCCESS', '日志服务启动成功', 'system');
}

// 创建日志元素
function createLogElement(log) {
    const logElement = document.createElement('div');
    logElement.className = 'log-entry';
    
    const levelClass = `log-level ${log.level}`;
    
    logElement.innerHTML = `
        <div class="log-header">
            <div class="log-timestamp">${formatDateTime(log.timestamp)}</div>
            <div class="${levelClass}">${log.level}</div>
        </div>
        <div class="log-function">函数: ${log.function}</div>
        <div class="log-message">${log.message}</div>
    `;
    
    return logElement;
}

// 格式化日期时间
function formatDateTime(isoString) {
    try {
        const date = new Date(isoString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (e) {
        return isoString; // 如果解析失败，返回原始字符串
    }
}

// 加载日志
async function loadLogs() {
  const logsContainer = document.getElementById('logsContainer');
  logsContainer.innerHTML = '<div class="loading">加载日志中...</div>';
  
  try {
    // 获取筛选条件
    const level = document.getElementById('levelFilter').value;
    const func = document.getElementById('functionFilter').value;
    const search = document.getElementById('searchInput').value;
    
    // 构建查询参数
    const params = new URLSearchParams();
    if (level) params.append('level', level);
    if (func) params.append('function', func);
    if (search) params.append('search', search);
    
    const response = await fetch(`/api/logs?${params.toString()}`);
    
    // 检查响应状态
    if (!response.ok) {
      // 尝试获取错误响应体
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        errorBody = await response.text();
      }
      
      throw new Error(`API 返回错误: ${response.status} - ${JSON.stringify(errorBody)}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.logs || data.logs.length === 0) {
      logsContainer.innerHTML = '<div class="empty">没有找到日志记录</div>';
      updateStats([]);
      return;
    }
    
    logsContainer.innerHTML = '';
    
    // 创建日志元素
    data.logs.forEach(log => {
      const logElement = createLogElement(log);
      logsContainer.appendChild(logElement);
    });
    
    // 更新统计信息
    updateStats(data.logs);
    
  } catch (error) {
    logsContainer.innerHTML = `
      <div class="error">
        <h3>加载日志失败</h3>
        <pre>${error.message}</pre>
        <p>请尝试：</p>
        <ul>
          <li>检查控制台获取更多信息</li>
          <li>刷新页面</li>
          <li>直接访问 <a href="/api/logs" target="_blank">/api/logs</a></li>
        </ul>
      </div>
    `;
    console.error('日志加载错误详情:', error);
  }
}

// 更新统计信息
function updateStats(logs) {
  if (!document.getElementById('logCount')) return;
  
  document.getElementById('logCount').textContent = logs.length;
  
  const counts = {
    INFO: 0,
    SUCCESS: 0,
    WARN: 0,
    ERROR: 0
  };
  
  logs.forEach(log => {
    counts[log.level] = (counts[log.level] || 0) + 1;
  });
  
  document.getElementById('infoCount').textContent = counts.INFO;
  document.getElementById('successCount').textContent = counts.SUCCESS;
  document.getElementById('warnCount').textContent = counts.WARN;
  document.getElementById('errorCount').textContent = counts.ERROR;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 初始化页面元素
  if (document.getElementById('lastUpdate')) {
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString();
  }
  
  if (document.getElementById('logsContainer')) {
    loadLogs();
    
    // 添加筛选器事件监听
    document.getElementById('levelFilter').addEventListener('change', loadLogs);
    document.getElementById('functionFilter').addEventListener('change', loadLogs);
    document.getElementById('searchInput').addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(loadLogs, 500);
    });
  }
});

// 清空日志
async function clearLogs() {
  if (!confirm('确定要清空所有日志吗？此操作不可撤销！')) return;
  
  try {
    const response = await fetch('/api/logs', { method: 'DELETE' });
    const data = await response.json();
    
    if (data.success) {
      alert('日志已成功清空');
      loadLogs();
    } else {
      alert('清空日志失败: ' + data.message);
    }
  } catch (error) {
    alert('请求失败: ' + error.message);
  }
}

// 自动刷新功能
let autoRefreshTimer = null;

function startAutoRefresh() {
  stopAutoRefresh();
  autoRefreshTimer = setInterval(loadLogs, 10000);
  alert('已启用10秒自动刷新');
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
    alert('已停止自动刷新');
  }
}

// 导出函数供HTML使用
window.loadLogs = loadLogs;
window.clearLogs = clearLogs;
window.startAutoRefresh = startAutoRefresh;
window.stopAutoRefresh = stopAutoRefresh;