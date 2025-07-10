export default function Home() {
  const sendData = async () => {
    try {
      const response = await fetch("/api/save-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello from Vercel!" })
      });
      
      const result = await response.json();
      alert(result.success ? "数据保存成功!" : "保存失败: " + result.error);
    } catch (error) {
      alert("请求失败: " + error.message);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>MySQL 测试应用</h1>
      <button 
        onClick={sendData}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        发送测试数据
      </button>
    </div>
  );
}