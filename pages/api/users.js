import pool from '../../lib/db';

// 初始化数据库（首次访问时）
let isInitialized = false;

export default async function handler(req, res) {
  // 初始化数据库
  if (!isInitialized) {
    try {
      await initDatabase();
      isInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      return res.status(500).json({ error: 'Database initialization failed' });
    }
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // GET请求 - 获取所有用户
    if (req.method === 'GET') {
      const [rows] = await connection.query(
        'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
      );
      return res.status(200).json(rows);
    }

    // POST请求 - 创建新用户
    if (req.method === 'POST') {
      const { name, email } = req.body;
      
      // 验证输入
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
      
      // 插入新用户
      const [result] = await connection.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email]
      );
      
      // 返回新创建的用户
      const [newUser] = await connection.execute(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [result.insertId]
      );
      
      return res.status(201).json(newUser[0]);
    }

    // 处理其他HTTP方法
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Database error:', error);
    
    // 处理唯一约束错误
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    
    return res.status(500).json({ error: 'Database operation failed' });
  } finally {
    if (connection) connection.release();
  }
}