import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: '仅支持POST请求' 
    });
  }

  const { name, email, message } = req.body;
  
  // 验证输入
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false,
      message: '所有字段都是必填项' 
    });
  }

  try {
    // 创建数据库连接
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : undefined
    });

    // 创建数据表（如果不存在）
    await db.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 插入数据
    const [result] = await db.execute(
      'INSERT INTO submissions (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    await db.end();

    res.status(200).json({
      success: true,
      message: '数据已成功存储到MySQL',
      data: {
        id: result.insertId,
        name,
        email,
        message
      }
    });
    
  } catch (error) {
    console.error('数据库错误:', error);
    res.status(500).json({
      success: false,
      message: '数据库操作失败: ' + error.message
    });
  }
}