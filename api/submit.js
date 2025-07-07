import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // 1. 记录请求开始
  console.log(`[${new Date().toISOString()}] 收到 ${req.method} 请求到 ${req.url}`);
  
  // 2. 只处理 POST 请求
  if (req.method !== 'POST') {
    console.warn('⚠️ 不支持的请求方法:', req.method);
    return res.status(405).json({ 
      success: false,
      message: '仅支持 POST 请求' 
    });
  }

  // 3. 获取请求体数据
  const { name, email, message } = req.body;
  console.log('📝 请求数据:', { name, email, message });
  
  // 4. 验证输入
  if (!name || !email || !message) {
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!message) missingFields.push('message');
    
    console.error('❌ 缺少必填字段:', missingFields.join(', '));
    return res.status(400).json({ 
      success: false,
      message: `缺少必填字段: ${missingFields.join(', ')}` 
    });
  }

  // 5. 从环境变量获取数据库配置
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306, // 确保转换为数字
    ssl: { 
      rejectUnauthorized: false // 必须的SSL配置
    },
    connectTimeout: 10000, // 10秒连接超时
    timezone: '+00:00' // UTC时区
  };
  
  console.log('🔌 数据库配置:', {
    ...dbConfig,
    password: '***' // 不记录真实密码
  });

  let connection;
  try {
    // 6. 创建数据库连接
    console.log('🛠️ 创建数据库连接...');
    connection = await mysql.createConnection(dbConfig);
    
    // 7. 测试数据库连接
    console.log('🧪 测试数据库连接...');
    const [testResult] = await connection.query('SELECT 1 + 1 AS solution, NOW() AS db_time, VERSION() AS version');
    console.log('✅ 数据库连接测试成功:', {
      solution: testResult[0].solution, // 应该是2
      dbTime: testResult[0].db_time,
      version: testResult[0].version
    });
    
    // 8. 创建表（如果不存在）
    console.log('📊 确保数据表存在...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // 9. 插入数据
    console.log('💾 插入数据到数据库...');
    const [insertResult] = await connection.execute(
      'INSERT INTO submissions (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    
    console.log('👍 数据插入成功, ID:', insertResult.insertId);
    
    // 10. 关闭连接
    await connection.end();
    console.log('🔌 数据库连接已关闭');
    
    // 11. 返回成功响应
    return res.status(200).json({
      success: true,
      message: '数据已成功存储到MySQL',
      data: {
        id: insertResult.insertId,
        name,
        email,
        message,
        created_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('🔥 数据库操作失败:', error);
    
    // 12. 错误处理
    let errorMessage = '数据库操作失败';
    let errorDetails = {};
    
    // 解析常见错误类型
    if (error.code) {
      switch (error.code) {
        case 'ECONNREFUSED':
          errorMessage = '无法连接到数据库服务器';
          errorDetails = { 
            host: dbConfig.host, 
            port: dbConfig.port,
            suggestion: '检查主机和端口是否正确，确保数据库服务正在运行'
          };
          break;
        case 'ER_ACCESS_DENIED_ERROR':
          errorMessage = '数据库访问被拒绝';
          errorDetails = { 
            user: dbConfig.user,
            suggestion: '检查用户名和密码是否正确，确认用户有访问权限'
          };
          break;
        case 'ER_BAD_DB_ERROR':
          errorMessage = '数据库不存在';
          errorDetails = { 
            database: dbConfig.database,
            suggestion: '检查数据库名称是否正确，或创建该数据库'
          };
          break;
        default:
          errorMessage = `数据库错误: ${error.code}`;
      }
    }
    
    // 13. 确保关闭连接（如果已创建）
    if (connection) {
      try {
        await connection.end();
        console.log('🔌 已关闭数据库连接');
      } catch (endError) {
        console.error('❌ 关闭连接时出错:', endError);
      }
    }
    
    // 14. 返回错误响应
    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        sqlMessage: error.sqlMessage || error.message,
        ...errorDetails
      }
    });
  }
}

// 15. 配置Vercel函数超时时间（延长到30秒）
export const config = {
  maxDuration: 30
};