document.addEventListener('DOMContentLoaded', () => {
    const apiButton = document.getElementById('apiButton');
    const apiResponse = document.getElementById('apiResponse');
    
    apiButton.addEventListener('click', async () => {
        apiResponse.textContent = "调用API中，请稍候...";
        apiResponse.style.color = "#333";
        
        try {
            const response = await fetch('/api/hello');
            const data = await response.json();
            
            apiResponse.textContent = JSON.stringify(data, null, 2);
            apiResponse.style.color = "#0070f3";
        } catch (error) {
            apiResponse.textContent = `API调用失败: ${error.message}`;
            apiResponse.style.color = "#f31260";
        }
    });
});