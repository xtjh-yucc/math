// 教師管理密碼驗證 (遵守設定規範)
window.onload = function() {
    const password = prompt("數學小幫手系統啟動\n請輸入教師管理密碼：");
    if (password !== "xtjh") {
        document.body.innerHTML = "<div class='min-h-screen flex items-center justify-center bg-red-50 text-red-600 text-2xl font-bold'>密碼錯誤，拒絕存取。</div>";
        return;
    }
    initApp();
};

function initApp() {
    // Tab 切換邏輯
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    // 複製 GAS 程式碼
    document.getElementById('copyGasBtn').addEventListener('click', function() {
        const code = document.getElementById('gasCodeText').innerText;
        navigator.clipboard.writeText(code).then(() => {
            this.innerHTML = '<i class="fa-solid fa-check mr-1"></i>已複製';
            this.classList.replace('bg-gray-700', 'bg-green-600');
            setTimeout(() => {
                this.innerHTML = '<i class="fa-regular fa-copy mr-1"></i>複製程式碼';
                this.classList.replace('bg-green-600', 'bg-gray-700');
            }, 2000);
        });
    });

    // 產生學生端 HTML 檔案
    document.getElementById('generateBtn').addEventListener('click', generateStudentHTML);

    // 載入示範資料
    document.getElementById('loadDemoBtn').addEventListener('click', loadDemoData);

    // 載入雲端資料
    document.getElementById('loadGasBtn').addEventListener('click', loadGasData);
}

// 產生學生端畫板網頁核心邏輯
function generateStudentHTML() {
    const taskName = document.getElementById('taskName').value || '未命名畫記任務';
    const gasUrl = document.getElementById('gasUrl').value || '';

    if (!gasUrl) {
        alert("請先填寫 GAS 部署網址，學生才能成功上傳作品！");
        return;
    }

    // 學生端 HTML 字串模版 (包含觸控/Apple Pencil畫記邏輯與相機呼叫)
    const studentHtmlString = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${taskName} - 學生畫板</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { margin: 0; overflow: hidden; background-color: #e5e7eb; touch-action: none; }
        #canvas-container { position: relative; width: 100vw; height: calc(100vh - 70px); background: #fff; }
        canvas { position: absolute; top: 0; left: 0; cursor: crosshair; }
        /* 隱藏原生檔案選擇按鈕 */
        #cameraInput { display: none; }
    </style>
</head>
<body class="flex flex-col h-screen">
    <!-- 頂部工具列 -->
    <div class="h-[70px] bg-white shadow-md flex items-center justify-between px-4 z-10 shrink-0">
        <div class="flex items-center space-x-3">
            <label for="cameraInput" class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full cursor-pointer flex items-center shadow-sm">
                <i class="fa-solid fa-camera text-xl mr-2"></i>拍照/相簿
            </label>
            <input type="file" id="cameraInput" accept="image/*">
            
            <div class="w-px h-8 bg-gray-300 mx-2"></div>
            
            <button id="penBtn" class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center ring-2 ring-offset-2 ring-black" title="畫筆">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button id="colorRedBtn" class="w-8 h-8 rounded-full bg-red-500 hover:ring-2 ring-offset-2 ring-red-500 transition-all"></button>
            <button id="colorBlueBtn" class="w-8 h-8 rounded-full bg-blue-500 hover:ring-2 ring-offset-2 ring-blue-500 transition-all"></button>
            
            <button id="eraserBtn" class="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 ml-2" title="橡皮擦">
                <i class="fa-solid fa-eraser"></i>
            </button>
            <button id="clearBtn" class="text-red-500 hover:bg-red-50 px-3 py-2 rounded ml-2 text-sm">清空</button>
        </div>
        
        <div class="flex items-center">
            <span class="font-bold text-gray-700 mr-4 hidden md:inline">${taskName}</span>
            <button id="submitBtn" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold shadow-md flex items-center">
                <i class="fa-solid fa-paper-plane mr-2"></i>繳交
            </button>
        </div>
    </div>

    <!-- 畫布區 -->
    <div id="canvas-container">
        <canvas id="drawingBoard"></canvas>
    </div>

    <!-- 載入中遮罩 -->
    <div id="loadingOverlay" class="fixed inset-0 bg-black bg-opacity-70 hidden z-50 flex flex-col justify-center items-center text-white">
        <i class="fa-solid fa-spinner fa-spin text-5xl mb-4"></i>
        <p class="text-xl font-bold">作品上傳中，請稍候...</p>
    </div>

    <script>
        const canvas = document.getElementById('drawingBoard');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('canvas-container');
        
        let isDrawing = false;
        let currentColor = '#000000';
        let currentMode = 'pen'; // 'pen' or 'eraser'
        let lastX = 0, lastY = 0;

        // 設定畫布尺寸符合容器
        function resizeCanvas() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // 工具列事件
        document.getElementById('penBtn').addEventListener('click', () => setMode('pen', '#000000'));
        document.getElementById('colorRedBtn').addEventListener('click', () => setMode('pen', '#ef4444'));
        document.getElementById('colorBlueBtn').addEventListener('click', () => setMode('pen', '#3b82f6'));
        document.getElementById('eraserBtn').addEventListener('click', () => setMode('eraser', null));
        document.getElementById('clearBtn').addEventListener('click', () => {
            if(confirm('確定要清空畫板嗎？')) ctx.clearRect(0, 0, canvas.width, canvas.height);
        });

        function setMode(mode, color) {
            currentMode = mode;
            if(color) currentColor = color;
            
            // UI 回饋
            ['penBtn', 'eraserBtn'].forEach(id => document.getElementById(id).classList.remove('ring-2', 'ring-offset-2', 'ring-black', 'bg-gray-400'));
            if(mode === 'pen') {
                document.getElementById('penBtn').classList.add('ring-2', 'ring-offset-2', 'ring-black');
            } else {
                document.getElementById('eraserBtn').classList.add('ring-2', 'ring-offset-2', 'ring-black', 'bg-gray-400');
            }
        }

        // 畫記邏輯 (支援滑鼠與觸控/Apple Pencil)
        function getPointerPos(e) {
            const rect = canvas.getBoundingClientRect();
            // 處理多點觸控，取第一個點
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        }

        function startDrawing(e) {
            isDrawing = true;
            const pos = getPointerPos(e);
            lastX = pos.x;
            lastY = pos.y;
        }

        function draw(e) {
            if (!isDrawing) return;
            e.preventDefault(); // 防止滾動
            const pos = getPointerPos(e);
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            
            if (currentMode === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 30;
                ctx.stroke();
                ctx.globalCompositeOperation = 'source-over';
            } else {
                ctx.strokeStyle = currentColor;
                // 利用 pressure 判斷筆觸粗細 (若裝置支援)
                let pressure = e.touches && e.touches[0].force ? e.touches[0].force : 0.5;
                if(pressure === 0) pressure = 0.5;
                ctx.lineWidth = currentMode === 'pen' ? (pressure * 8) + 2 : 4;
                ctx.stroke();
            }
            lastX = pos.x;
            lastY = pos.y;
        }

        function stopDrawing() { isDrawing = false; }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, {passive: false});
        canvas.addEventListener('touchmove', draw, {passive: false});
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);

        // 處理照片載入至畫布
        document.getElementById('cameraInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // 圖片等比例縮放至畫布中央
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio  = Math.min( hRatio, vRatio );
                const centerShift_x = ( canvas.width - img.width*ratio ) / 2;
                const centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
                ctx.drawImage(img, 0,0, img.width, img.height, centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);
            }
            img.src = URL.createObjectURL(file);
        });

        // 繳交邏輯
        document.getElementById('submitBtn').addEventListener('click', () => {
            const studentName = prompt('請輸入你的姓名/座號：');
            if (!studentName) return;

            document.getElementById('loadingOverlay').classList.remove('hidden');
            
            // 將畫布轉為 Base64 (壓低品質以利傳輸)
            const imageData = canvas.toDataURL('image/jpeg', 0.6);
            
            const payload = {
                name: studentName,
                taskName: '${taskName}',
                image: imageData
            };

            fetch('${gasUrl}', {
                method: 'POST',
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(res => {
                document.getElementById('loadingOverlay').classList.add('hidden');
                if(res.status === 'success') {
                    alert('作品已成功送出！老師已經收到了。');
                    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空畫布
                } else {
                    alert('上傳失敗，請稍後再試。錯誤訊息：' + res.message);
                }
            })
            .catch(err => {
                document.getElementById('loadingOverlay').classList.add('hidden');
                alert('網路錯誤，請確認網路連線。');
            });
        });
    <\/script>
</body>
</html>`;

    // 使用 Blob 將字串轉為檔案下載防崩潰
    const blob = new Blob([studentHtmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `學生畫板_${taskName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 開啟圖片放大 Modal
window.openModal = function(src) {
    document.getElementById('modalImg').src = src;
    document.getElementById('imageModal').classList.remove('hidden');
};

// 渲染表格資料
function renderTable(dataArray) {
    const tbody = document.getElementById('recordTableBody');
    document.getElementById('totalCount').innerText = dataArray.length;
    
    if(dataArray.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-sm text-gray-500">沒有找到任何資料。</td></tr>`;
        return;
    }

    let html = '';
    dataArray.forEach(item => {
        html += `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(item.time).toLocaleString('zh-TW')}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${item.name}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${item.imageUrl}" class="h-16 w-auto cursor-pointer rounded border border-gray-300 hover:shadow-md transition-shadow" onclick="openModal('${item.imageUrl}')" alt="學生畫記">
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// 載入示範資料
function loadDemoData() {
    const demoData = [
        { time: new Date().getTime(), name: "王小明", taskName: "生物細胞構造畫記", imageUrl: "https://images.unsplash.com/photo-1555505019-8c3f1c4aba5f?auto=format&fit=crop&w=300&q=80" },
        { time: new Date().getTime() - 3600000, name: "林小華", taskName: "生物細胞構造畫記", imageUrl: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=300&q=80" },
        { time: new Date().getTime() - 7200000, name: "陳大寶", taskName: "生物細胞構造畫記", imageUrl: "https://images.unsplash.com/photo-1611078488390-3cb83e58c3db?auto=format&fit=crop&w=300&q=80" }
    ];
    renderTable(demoData);
}

// 載入 GAS 真實雲端資料
function loadGasData() {
    const gasUrl = document.getElementById('gasUrl').value;
    if(!gasUrl) {
        alert("請先在「設定與分發」分頁填寫 GAS 網址！");
        return;
    }

    const btn = document.getElementById('loadGasBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>載入中...';
    btn.disabled = true;

    fetch(gasUrl)
        .then(res => res.json())
        .then(data => {
            renderTable(data);
        })
        .catch(err => {
            alert("載入失敗，請確認 GAS 網址是否正確，以及是否已設定「所有人」皆可存取。");
            console.error(err);
        })
        .finally(() => {
            btn.innerHTML = '<i class="fa-solid fa-rotate mr-1"></i>一鍵載入雲端紀錄';
            btn.disabled = false;
        });
}