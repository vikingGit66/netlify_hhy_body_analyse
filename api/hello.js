export default function handler(req, res) {
    res.json({ 
      message: "这是最简单的API响应",
      status: "成功",
      time: new Date().toISOString() 
    });
  }