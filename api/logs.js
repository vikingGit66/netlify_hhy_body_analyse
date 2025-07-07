// 内存日志存储
let logs = [];
const MAX_LOG_ENTRIES = 1000;

// 添加日志条目
export function addLogEntry(level, message, functionName = 'unknown') {
  const timestamp = new Date().toISOString();
  const logEntry = {
    id: Date.now(),
    timestamp,
    level,
    function: functionName,
    message
  };
  
  logs.unshift(logEntry); // 添加到开头（最新在前）
  
  // 限制日志大小
  if (logs.length > MAX_LOG_ENTRIES) {
    logs.pop(); // 移除最旧的日志
  }
  
  return logEntry;
}

// 获取日志
export function getLogs(filter = {}) {
  let result = [...logs];
  
  // 应用过滤
  if (filter.level) {
    result = result.filter(entry => entry.level === filter.level);
  }
  
  if (filter.function) {
    result = result.filter(entry => entry.function === filter.function);
  }
  
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    result = result.filter(entry => 
      entry.message.toLowerCase().includes(searchLower) ||
      entry.function.toLowerCase().includes(searchLower)
    );
  }
  
  // 限制返回数量
  if (filter.limit) {
    result = result.slice(0, filter.limit);
  }
  
  return result;
}

// 清空日志
export function clearLogs() {
  logs = [];
  return { success: true, message: '日志已清空' };
}

// API处理函数
export default function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // 获取查询参数
        const level = req.query.level;
        const func = req.query.function;
        const search = req.query.search;
        const limit = req.query.limit ? parseInt(req.query.limit) : 100;
        
        const logs = getLogs({ level, function: func, search, limit });
        res.status(200).json({ success: true, logs });
        break;
        
      case 'DELETE':
        const result = clearLogs();
        res.status(200).json(result);
        break;
        
      default:
        res.status(405).json({ 
          success: false, 
          message: '仅支持 GET 和 DELETE 方法' 
        });
    }
  } catch (error) {
    addLogEntry('ERROR', `日志API错误: ${error.message}`, 'logs');
    res.status(500).json({ 
      success: false, 
      message: '服务器错误',
      error: error.message 
    });
  }
}