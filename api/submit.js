import { addLogEntry } from './logs.js';

export default async function handler(req, res) {
  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const log = (level, message) => addLogEntry(level, `[${requestId}] ${message}`, 'submit');
  
  log('INFO', `收到 ${req.method} 请求到 ${req.url}`);
  
  // 只处理POST请求
  if (req.method !== 'POST') {
    log('WARN', `不支持的请求方法: ${req.method}`);
    return res.status(405).json({ 
      success: false,
      message: '仅支持 POST 请求' 
    });
  }

  // 获取请求体数据
  const { name, email, message } = req.body;
  log('INFO', `请求数据: ${JSON.stringify({name, email})}`);
  
  // 验证输入
  if (!name || !email || !message) {
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!message) missingFields.push('message');
    
    log('ERROR', `缺少必填字段: ${missingFields.join(', ')}`);
    return res.status(400).json({ 
      success: false,
      message: `缺少必填字段: ${missingFields.join(', ')}` 
    });
  }

  // 模拟数据库操作
  try {
    log('INFO', '开始处理数据');
    
    // 模拟数据库插入
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockId = Math.floor(Math.random() * 1000);
    
    log('SUCCESS', `数据插入成功, ID: ${mockId}`);
    
    return res.status(200).json({
      success: true,
      message: '数据已成功处理',
      data: {
        id: mockId,
        name,
        email,
        message
      }
    });
    
  } catch (error) {
    log('ERROR', `处理失败: ${error.message}`);
    
    return res.status(500).json({
      success: false,
      message: '数据处理失败',
      error: error.message
    });
  }
}