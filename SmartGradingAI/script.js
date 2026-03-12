document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadSection = document.getElementById('uploadSection');
    const processingSection = document.getElementById('processingSection');
    const resultSection = document.getElementById('resultSection');
    const progressBar = document.getElementById('progressBar');

    // 處理拖曳事件
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropzone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropzone.classList.remove('dragover');
    }

    // 處理檔案放置
    dropzone.addEventListener('drop', handleDrop, false);
    
    // 處理檔案選擇
    fileInput.addEventListener('change', handleFiles, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (files.length > 0) {
            startProcessing();
        }
    }

    // 模擬 AI 處理過程
    function startProcessing() {
        uploadSection.classList.add('hidden');
        processingSection.classList.remove('hidden');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(showResults, 500);
            }
            progressBar.style.width = `${progress}%`;
        }, 300);
    }

    // 顯示結果
    function showResults() {
        processingSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
    }
});

// 重置應用程式（提供給按鈕使用）
window.resetApp = function() {
    const uploadSection = document.getElementById('uploadSection');
    const resultSection = document.getElementById('resultSection');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');

    fileInput.value = '';
    progressBar.style.width = '0%';
    
    resultSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
};
