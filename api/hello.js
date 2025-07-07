export default function handler(req, res) {
    res.json({ 
      message: "MySQL数据上传演示API",
      status: "运行正常",
      time: new Date().toISOString() 
    });
  }