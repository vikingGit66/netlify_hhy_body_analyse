export default function handler(req, res) {
    res.status(200).json({ 
      status: "success",
      message: "Hello from Vercel API!",
      timestamp: new Date().toISOString(),
      deployment: "通过Vercel UI界面导入的工程",
      features: [
        "静态网站托管",
        "Serverless API",
        "自动HTTPS",
        "全球CDN加速"
      ]
    });
  }