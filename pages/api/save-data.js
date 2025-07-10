import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 从环境变量获取数据库配置
  const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    ssl: process.env.MYSQL_SSL ? { rejectUnauthorized: true } : null
  };

  try {
    // 创建数据库连接
    const connection = await mysql.createConnection(dbConfig);
    
    // 插入数据
    const [result] = await connection.execute(
      'INSERT INTO test_data (message) VALUES (?)',
      [req.body.message || 'Default message']
    );

    await connection.end();
    
    return res.status(200).json({ 
      success: true,
      insertedId: result.insertId 
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}