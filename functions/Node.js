const express = require('express');
const mysql = require('mysql2/promise');

// 创建 Express 应用
const app = express();
app.use(express.json());

// MySQL 连接配置
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

// 测试路由
app.get('/test', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM your_table_name LIMIT 10'); // 替换为你的表名
    connection.end();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 将 Express 应用转换为 Netlify Function
exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    app(event, context, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};



