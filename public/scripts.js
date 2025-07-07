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
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 添加初始日志（演示用）
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/logs.html') {
        // 添加一些初始日志作为演示
        const initialLogs = [
            {
                id: Date.now(),
                timestamp: new Date(Date.now() - 300000).toISOString(),
                level: 'INFO',
                function: 'system',
                message: '系统启动完成，日志服务已初始化'
            },
            {
                id: Date.now() + 1,
                timestamp: new Date(Date.now() - 250000).toISOString(),
                level: 'SUCCESS',
                function: 'submit',
                message: '数据提交成功，ID: 12345'
            },
            {
                id: Date.now() + 2,
                timestamp: new Date(Date.now() - 200000).toISOString(),
                level: 'WARN',
                function: 'logs',
                message: '日志存储接近上限 (850/1000)'
            },
            {
                id: Date.now() + 3,
                timestamp: new Date(Date.now() - 150000).toISOString(),
                level: 'ERROR',
                function: 'submit',
                message: '数据处理失败: 模拟错误'
            }
        ];
        
        initialLogs.forEach(log => {
            const logElement = createLogElement(log);
            document.getElementById('logsContainer')?.appendChild(logElement);
        });
    }
});