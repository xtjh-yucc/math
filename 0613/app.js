window.onload = function() {
    const password = prompt("數學小幫手 V4 系統\n請輸入密碼：");
    if (password !== "xtjh") return document.body.innerHTML = "<div class='p-10 text-red-600 font-bold'>密碼錯誤，拒絕存取。</div>";
    initApp();
};

let globalRecordData = [];
let currentGradeTimeId = null;
let currentGradeStudent = "";

// 教師批改畫布變數
const gCanvas = document.getElementById('gradeCanvas');
const gCtx = gCanvas ? gCanvas.getContext('2d') : null;
let isGDrawing = false;
let gLastX = 0, gLastY = 0;
let currentLoadedImage = null;

function initApp() {
    // 讀取瀏覽器暫存設定
    if(localStorage.getItem('xtjh_gasUrl')) document.getElementById('gasUrl').value = localStorage.getItem('xtjh_gasUrl');
    if(localStorage.getItem('xtjh_taskName')) document.getElementById('taskName').value = localStorage.getItem('xtjh_taskName');
    if(localStorage.getItem('xtjh_attachmentUrl')) document.getElementById('attachmentUrl').value = localStorage.getItem('xtjh_attachmentUrl');

    ['gasUrl', 'taskName', 'attachmentUrl'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', (e) => localStorage.setItem('xtjh_' + id, e.target.value));
    });

    // 綁定分頁
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.target);
            if(target) target.classList.add('active');
        });
    });

    // 🌟 終極防護：加上 ?. 確保找不到按鈕時不會當機
    document.getElementById('generateBtn')?.addEventListener('click', generateStudentHTML);
    document.getElementById('loadGasBtn')?.addEventListener('click', loadGasData);
    document.getElementById('searchName')?.addEventListener('input', filterTable);
    document.getElementById('searchTask')?.addEventListener('input', filterTable);

    if(gCanvas) {
        gCanvas.addEventListener('mousedown', gStart);
        gCanvas.addEventListener('mousemove', gDraw);
        gCanvas.addEventListener('mouseup', gStop);
        gCanvas.addEventListener('mouseout', gStop);
    }
    document.getElementById('submitGradeBtn')?.addEventListener('click', submitGrade);
}

// ============== 教師端搜尋與表格渲染 ==============
function loadGasData() {
    const gasUrl = document.getElementById('gasUrl').value;
    if(!gasUrl) return alert("請先填寫 GAS 網址！");
    
    const btn = document.getElementById('loadGasBtn');
    if(btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i>載入中...';
    
    fetch(gasUrl)
        .then(res => res.json())
        .then(data => {
            globalRecordData = data;
            filterTable(); 
        })
        .catch(err => alert("載入失敗，請確認網址正確且 GAS 權限已全開。"))
        .finally(() => {
            if(btn) btn.innerHTML = '<i class="fa-solid fa-rotate mr-1"></i>載入雲端紀錄';
        });
}

function filterTable() {
    const sName = document.getElementById('searchName')?.value.toLowerCase() || "";
    const sTask = document.getElementById('searchTask')?.value.toLowerCase() || "";
    
    const filtered = globalRecordData.filter(item => {
        const itemName = String(item.name || "").toLowerCase();
        const itemTask = String(item.taskName || "").toLowerCase();
        return itemName.includes(sName) && itemTask.includes(sTask);
    });

    const tbody = document.getElementById('recordTableBody');
    if(!tbody) return;

    if(filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500">沒有符合的資料。</td></tr>`;
        return;
    }

    let html = '';
    filtered.forEach(item => {
        const hasGraded = item.gradedImg && item.gradedImg !== "";
        const badgeColor = hasGraded ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
        const badgeText = hasGraded ? '已批改' : '待批改';
        const scoreText = item.score ? `<span class="font-bold text-xl text-red-600">${item.score}</span>` : '<span class="text-gray-400">-</span>';

        html += `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-4 text-sm">
                <div class="font-bold text-gray-800">${item.name}</div>
                <div class="text-xs text-gray-500">${new Date(item.timeStr).toLocaleString('zh-TW')}</div>
                <div class="text-xs text-indigo-600 mt-1">${item.taskName}</div>
            </td>
            <td class="px-4 py-4">
                <div class="flex space-x-2 items-center">
                    <a href="${item.originalImg}" target="_blank"><img src="${item.originalImg}" class="h-12 w-16 object-cover rounded border" title="原圖"></a>
                    ${hasGraded ? `<i class="fa-solid fa-arrow-right text-gray-300"></i><a href="${item.gradedImg}" target="_blank"><img src="${item.gradedImg}" class="h-12 w-16 object-cover rounded border border-red-400" title="批改後"></a>` : ''}
                    <span class="ml-2 px-2 py-1 text-xs rounded-full ${badgeColor}">${badgeText}</span>
                </div>
            </td>
            <td class="px-4 py-4 text-center">${scoreText}</td>
            <td class="px-4 py-4 text-right">
                <button onclick="openGradeModal('${item.timeId}', '${item.name}', '${item.originalImg}', '${item.score}')" class="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm shadow-sm transition">
                    <i class="fa-solid fa-pen-ruler mr-1"></i>批改
                </button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// ============== 教師端批改畫布邏輯 ==============
window.openGradeModal = function(timeId, name, imgUrl, oldScore) {
    currentGradeTimeId = timeId;
    currentGradeStudent = name;
    document.getElementById('gradeModalTitle').innerText = `批改作業 - ${name}`;
    document.getElementById('gradeScore').value = oldScore || "";
    document.getElementById('gradeModal').classList.remove('hidden');
    
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.onload = function() {
        currentLoadedImage = img;
        resizeGradeCanvas();
    }
    img.src = imgUrl;
};

window.closeGradeModal = function() { document.getElementById('gradeModal').classList.add('hidden'); };

function resizeGradeCanvas() {
    const container = document.getElementById('gradeCanvasContainer');
    container.className = "flex-1 bg-gray-200 flex justify-center items-center overflow-hidden";
    gCanvas.className = "cursor-crosshair shadow-lg"; 

    if(currentLoadedImage) {
        const ratio = Math.min(container.clientWidth / currentLoadedImage.width, container.clientHeight / currentLoadedImage.height);
        gCanvas.width = currentLoadedImage.width * ratio;
        gCanvas.height = currentLoadedImage.height * ratio;
        
        gCtx.fillStyle = '#ffffff';
        gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height);
        gCtx.drawImage(currentLoadedImage, 0, 0, gCanvas.width, gCanvas.height);
    }
}
window.clearGradeCanvas = resizeGradeCanvas;

function gStart(e) { isGDrawing = true; const pos = getGPos(e); gLastX = pos.x; gLastY = pos.y; }
function gDraw(e) {
    if(!isGDrawing) return;
    const pos = getGPos(e);
    gCtx.beginPath(); gCtx.moveTo(gLastX, gLastY); gCtx.lineTo(pos.x, pos.y);
    gCtx.strokeStyle = '#ef4444'; gCtx.lineWidth = 4; gCtx.lineCap = 'round'; gCtx.stroke();
    gLastX = pos.x; gLastY = pos.y;
}
function gStop() { isGDrawing = false; }
function getGPos(e) {
    const rect = gCanvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function submitGrade() {
    const score = document.getElementById('gradeScore').value;
    const btn = document.getElementById('submitGradeBtn');
    btn.innerText = "傳送中..."; btn.disabled = true;

    const payload = {
        action: 'teacher_grade',
        timeId: currentGradeTimeId,
        name: currentGradeStudent,
        score: score,
        image: gCanvas.toDataURL('image/jpeg', 0.6)
    };

    fetch(document.getElementById('gasUrl').value, {
        method: 'POST',
        body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => {
        if(res.status === 'success') {
            alert('批改完成！成績已回傳。');
            closeGradeModal();
            loadGasData(); 
        } else alert('發生錯誤');
    }).finally(() => { btn.innerText = "送出批改"; btn.disabled = false; });
}

// ============== 圖片壓縮引擎 ==============
function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const cvs = document.createElement('canvas');
                const MAX_WIDTH = 1200; 
                let w = img.width, h = img.height;
                if (w > MAX_WIDTH) { h = Math.round((h * MAX_WIDTH) / w); w = MAX_WIDTH; }
                cvs.width = w; cvs.height = h;
                const ctx = cvs.getContext('2d');
                ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,w,h);
                ctx.drawImage(img, 0, 0, w, h);
                resolve(cvs.toDataURL('image/jpeg', 0.6));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ============== 產生學生端 V4 HTML ==============
async function generateStudentHTML() {
    const taskName = document.getElementById('taskName').value || '隨堂作業';
    const gasUrl = document.getElementById('gasUrl').value;
    const attachmentUrl = document.getElementById('attachmentUrl').value || '';
    if (!gasUrl) return alert("請填寫 GAS 網址！");

    const btn = document.getElementById('generateBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>網頁打包中...';
    btn.disabled = true;

    let bgBase64 = "";
    const bgInput = document.getElementById('bgImageInput');
    if (bgInput && bgInput.files && bgInput.files[0]) {
        bgBase64 = await compressImage(bgInput.files[0]);
    }

    const htmlString = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>學生學習中心</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { touch-action: none; overflow:hidden; }
        #canvasWrapper { position: relative; width: 100%; height: 100%; background: #ffffff; }
        #bgCanvas, #drawingBoard { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        #bgCanvas { pointer-events: none; z-index: 1; }
        #drawingBoard { z-index: 2; cursor: crosshair; }
    </style>
</head>
<body class="bg-gray-100 h-screen flex flex-col">
    <div id="loginScreen" class="absolute inset-0 bg-blue-600 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center">
            <i class="fa-solid fa-graduation-cap text-5xl text-blue-500 mb-4"></i>
            <h2 class="text-2xl font-bold mb-6 text-gray-800">登入學習中心</h2>
            <input type="text" id="studentNameInput" placeholder="請輸入 座號+姓名 (例:01王小明)" class="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg font-bold">
            <button onclick="login()" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md transition">進入系統</button>
        </div>
    </div>

    <div class="h-16 bg-white shadow-sm flex items-center justify-between px-4 z-10 shrink-0">
        <div class="font-bold text-gray-700 flex items-center">
            <i class="fa-solid fa-user mr-2 text-blue-500"></i><span id="displayStuName"></span>
            <a href="${attachmentUrl}" target="_blank" id="attachmentBtn" class="ml-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs font-bold hover:bg-indigo-200 hidden"><i class="fa-solid fa-paperclip mr-1"></i>下載附件</a>
        </div>
        <div class="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button id="tabDraw" class="px-4 py-1.5 rounded-md bg-white shadow text-blue-600 font-bold text-sm">交作業</button>
            <button id="tabHistory" class="px-4 py-1.5 rounded-md text-gray-500 hover:bg-gray-200 font-bold text-sm">我的成績</button>
        </div>
    </div>

    <div id="drawSection" class="flex-1 flex flex-col hidden relative">
        <div class="bg-gray-50 border-b p-2 flex justify-between items-center shrink-0">
            <div class="flex space-x-2 items-center overflow-x-auto">
                <label class="bg-blue-100 text-blue-700 px-3 py-1.5 rounded cursor-pointer text-sm font-bold shrink-0"><i class="fa-solid fa-camera mr-1"></i>照片<input type="file" id="cameraInput" accept="image/*" class="hidden"></label>
                <div class="w-px h-6 bg-gray-300 mx-1 shrink-0"></div>
                <button id="penBtn" class="w-8 h-8 rounded-full bg-black ring-2 ring-offset-1 ring-black shrink-0" title="黑筆"></button>
                <button id="colorRedBtn" class="w-8 h-8 rounded-full bg-red-500 shrink-0" title="紅筆"></button>
                <button id="colorBlueBtn" class="w-8 h-8 rounded-full bg-blue-500 shrink-0" title="藍筆"></button>
                <button id="eraserBtn" class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center shrink-0" title="橡皮擦 (不傷底圖)"><i class="fa-solid fa-eraser"></i></button>
            </div>
            <div class="flex items-center pl-2 shrink-0">
                <button id="submitBtn" class="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded font-bold text-sm shadow">繳交</button>
            </div>
        </div>
        <div id="canvasWrapper">
            <canvas id="bgCanvas"></canvas>
            <canvas id="drawingBoard"></canvas>
        </div>
    </div>

    <div id="historySection" class="flex-1 hidden bg-gray-100 p-4 overflow-y-auto" style="touch-action: auto;">
        <h2 class="font-bold text-xl text-gray-800 mb-4 border-l-4 border-blue-500 pl-2">老師批改與成績</h2>
        <div id="historyList" class="space-y-4 pb-10 text-center"></div>
    </div>

    <script>
        const GAS_URL = '${gasUrl}';
        const ATTACHMENT_URL = '${attachmentUrl}';
        const INITIAL_BG = '${bgBase64}'; 
        let currentStudent = "";
        
        if(ATTACHMENT_URL && ATTACHMENT_URL.trim() !== '') {
            document.getElementById('attachmentBtn').classList.remove('hidden');
        }

        function login() {
            const name = document.getElementById('studentNameInput').value.trim();
            if(!name) return alert('請輸入姓名！');
            currentStudent = name;
            document.getElementById('displayStuName').innerText = name;
            document.getElementById('loginScreen').classList.add('hidden');
            switchTab('draw');
        }

        document.getElementById('tabDraw').addEventListener('click', () => switchTab('draw'));
        document.getElementById('tabHistory').addEventListener('click', () => switchTab('history'));

        function switchTab(tab) {
            document.getElementById('drawSection').classList.add('hidden');
            document.getElementById('historySection').classList.add('hidden');
            document.getElementById('tabDraw').classList.replace('bg-white', 'text-gray-500');
            document.getElementById('tabDraw').classList.remove('shadow', 'text-blue-600');
            document.getElementById('tabHistory').classList.replace('bg-white', 'text-gray-500');
            document.getElementById('tabHistory').classList.remove('shadow', 'text-blue-600');
            
            if(tab === 'draw') {
                document.getElementById('drawSection').classList.remove('hidden');
                document.getElementById('tabDraw').classList.add('bg-white', 'shadow', 'text-blue-600');
                document.getElementById('tabDraw').classList.remove('text-gray-500');
                resizeCanvases();
            } else {
                document.getElementById('historySection').classList.remove('hidden');
                document.getElementById('tabHistory').classList.add('bg-white', 'shadow', 'text-blue-600');
                document.getElementById('tabHistory').classList.remove('text-gray-500');
                fetchHistory(); 
            }
        }

        function fetchHistory() {
            const list = document.getElementById('historyList');
            list.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-3xl text-gray-400 mt-10"></i>';
            fetch(GAS_URL + "?studentName=" + encodeURIComponent(currentStudent))
            .then(res => res.json())
            .then(data => {
                if(data.length === 0) return list.innerHTML = '<div class="bg-white p-6 rounded-lg text-gray-500">尚無交件紀錄。</div>';
                let html = '';
                data.forEach(item => {
                    const hasGrade = item.score && item.score !== "";
                    html += \`
                    <div class="bg-white rounded-xl shadow p-4 border border-gray-100">
                        <div class="flex justify-between items-start mb-3">
                            <div><h3 class="font-bold text-gray-800 text-lg text-left">\${item.taskName}</h3><p class="text-xs text-gray-400">\${item.timeStr}</p></div>
                            <div class="text-right"><div class="text-xs text-gray-500 mb-1">老師給分</div>\${hasGrade ? \`<span class="text-2xl font-black text-red-600">\${item.score}</span>\` : '<span class="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded">等待批改</span>'}</div>
                        </div>
                        <div class="mt-2">\${item.gradedImg ? \`<img src="\${item.gradedImg}" class="w-full max-h-[60vh] object-contain rounded border-2 border-red-400 shadow-sm mx-auto">\` : \`<img src="\${item.originalImg}" class="w-full max-h-[60vh] object-contain rounded border border-gray-200 shadow-sm mx-auto">\`}</div>
                    </div>\`;
                });
                list.innerHTML = html;
            }).catch(err => list.innerHTML = '<div class="text-red-500">無法載入成績。</div>');
        }

        const bgCanvas = document.getElementById('bgCanvas');
        const bgCtx = bgCanvas.getContext('2d');
        const canvas = document.getElementById('drawingBoard');
        const ctx = canvas.getContext('2d');
        
        let isDrawing = false, currentMode = 'pen', currentColor = '#000000', lastX = 0, lastY = 0;
        let activeBackgroundImage = new Image();

        function drawBackground() {
            bgCtx.fillStyle = '#ffffff'; 
            bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
            if(activeBackgroundImage.src && activeBackgroundImage.src !== window.location.href) {
                const ratio = Math.min(bgCanvas.width/activeBackgroundImage.width, bgCanvas.height/activeBackgroundImage.height);
                const dx = (bgCanvas.width - activeBackgroundImage.width*ratio)/2;
                const dy = (bgCanvas.height - activeBackgroundImage.height*ratio)/2;
                bgCtx.drawImage(activeBackgroundImage, 0, 0, activeBackgroundImage.width, activeBackgroundImage.height, dx, dy, activeBackgroundImage.width*ratio, activeBackgroundImage.height*ratio);
            }
        }

        function resizeCanvases() {
            const w = canvas.parentElement.clientWidth;
            const h = canvas.parentElement.clientHeight;
            bgCanvas.width = w; bgCanvas.height = h;
            canvas.width = w; canvas.height = h;
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            drawBackground(); 
        }
        window.addEventListener('resize', resizeCanvases);

        if(INITIAL_BG) {
            activeBackgroundImage.onload = () => { if(document.getElementById('drawSection').classList.contains('hidden') === false) resizeCanvases(); };
            activeBackgroundImage.src = INITIAL_BG;
        }

        document.getElementById('penBtn').addEventListener('click', () => setMode('pen', '#000000'));
        document.getElementById('colorRedBtn').addEventListener('click', () => setMode('pen', '#ef4444'));
        document.getElementById('colorBlueBtn').addEventListener('click', () => setMode('pen', '#3b82f6'));
        document.getElementById('eraserBtn').addEventListener('click', () => setMode('eraser', null));
        
        function setMode(mode, color) {
            currentMode = mode;
            if(color) currentColor = color;
            ['penBtn', 'colorRedBtn', 'colorBlueBtn', 'eraserBtn'].forEach(id => document.getElementById(id).classList.remove('ring-2', 'ring-offset-1', 'ring-black', 'ring-red-500', 'ring-blue-500', 'bg-blue-100'));
            
            if(mode === 'pen') {
                ctx.globalCompositeOperation = 'source-over'; 
                if(currentColor === '#000000') document.getElementById('penBtn').classList.add('ring-2', 'ring-offset-1', 'ring-black');
                if(currentColor === '#ef4444') document.getElementById('colorRedBtn').classList.add('ring-2', 'ring-offset-1', 'ring-red-500');
                if(currentColor === '#3b82f6') document.getElementById('colorBlueBtn').classList.add('ring-2', 'ring-offset-1', 'ring-blue-500');
            } else {
                ctx.globalCompositeOperation = 'destination-out'; 
                document.getElementById('eraserBtn').classList.add('ring-2', 'ring-offset-1', 'ring-black', 'bg-blue-100');
            }
        }

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        }

        function startD(e) { isDrawing = true; const p = getPos(e); lastX = p.x; lastY = p.y; }
        function draw(e) {
            if (!isDrawing) return; e.preventDefault(); const p = getPos(e);
            ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentMode === 'eraser' ? 30 : 3;
            ctx.stroke(); lastX = p.x; lastY = p.y;
        }
        function stopD() { isDrawing = false; }

        canvas.addEventListener('mousedown', startD); canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopD); canvas.addEventListener('mouseout', stopD);
        canvas.addEventListener('touchstart', startD, {passive: false}); canvas.addEventListener('touchmove', draw, {passive: false});
        canvas.addEventListener('touchend', stopD); canvas.addEventListener('touchcancel', stopD);

        document.getElementById('cameraInput').addEventListener('change', function(e) {
            const file = e.target.files[0]; if (!file) return;
            activeBackgroundImage = new Image();
            activeBackgroundImage.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                drawBackground(); 
            }; 
            activeBackgroundImage.src = URL.createObjectURL(file);
        });

        document.getElementById('submitBtn').addEventListener('click', () => {
            const btn = document.getElementById('submitBtn');
            btn.innerText = '上傳中...'; btn.disabled = true;
            
            const mergeCanvas = document.createElement('canvas');
            mergeCanvas.width = canvas.width; mergeCanvas.height = canvas.height;
            const mCtx = mergeCanvas.getContext('2d');
            mCtx.drawImage(bgCanvas, 0, 0); 
            mCtx.drawImage(canvas, 0, 0);   
            
            const payload = {
                action: 'student_submit',
                timeId: new Date().getTime(),
                name: currentStudent,
                taskName: '${taskName}',
                image: mergeCanvas.toDataURL('image/jpeg', 0.5) 
            };

            fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payload) })
            .then(res => res.json()).then(res => {
                if(res.status === 'success') {
                    alert('作品已送出！');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    switchTab('history'); 
                } else alert('上傳失敗');
            }).finally(() => { btn.innerText = '繳交'; btn.disabled = false; });
        });
    <\/script>
</body>
</html>`;

    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `學生學習中心_${taskName}.html`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    btn.innerHTML = '<i class="fa-solid fa-download mr-2"></i>一鍵打包學生端網頁 (.html)';
    btn.disabled = false;
};