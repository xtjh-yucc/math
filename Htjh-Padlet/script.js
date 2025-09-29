// *** 修改重點：整個檔案包裹在 DOMContentLoaded 事件中 ***
document.addEventListener('DOMContentLoaded', () => {

    // ***************************************************
    // ** 重要！請在此貼上您自己的 Firebase 設定 **
    // ***************************************************
   

 const firebaseConfig = {
      apiKey: "AIzaSyCtM_-FIQ2AwaRRN7J7DjusTpiBv5DAkKk",
      authDomain: "htjh-padlet.firebaseapp.com",
      databaseURL: "https://htjh-padlet-default-rtdb.firebaseio.com",
      projectId: "htjh-padlet",
      storageBucket: "htjh-padlet.firebasestorage.app",
      messagingSenderId: "67721407497",
      appId: "1:67721407497:web:e3d33129c4c7a133615cd8",
measurementId: "G-T6YZXTFSC8"
    };






    // ***************************************************

    // *** 修改重點：改用 Compat 版本的初始化方式 ***
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();
    const storage = firebase.storage();

    // 全域狀態變數
    let currentTeacher = null;
    let currentStudent = null;
    let currentClassId = null;
    let currentPostId = null;
    let messagesListener = null;

    // DOM 元素 (和之前相同)
    const views = document.querySelectorAll('.view');
    const teacherLoginBtn = document.getElementById('teacher-login-btn');
    const studentLoginBtn = document.getElementById('student-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const classSelect = document.getElementById('class-select');
    const createClassBtn = document.getElementById('create-class-btn');
    const addStudentBtn = document.getElementById('add-student-btn');
    const createPostBtn = document.getElementById('create-post-btn');
    const padletBoard = document.getElementById('padlet-board');
    const addMessageBtn = document.getElementById('add-message-btn');
    const messageModal = document.getElementById('message-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const submitMessageBtn = document.getElementById('submit-message-btn');

    // 畫面切換函式 (和之前相同)
    const showView = (viewId) => {
        views.forEach(view => view.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    };

    // *** 修改重點：改用 Compat 版本的 onAuthStateChanged ***
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentTeacher = user;
            document.getElementById('teacher-welcome').textContent = `歡迎，${user.displayName}`;
            loadTeacherDashboard();
            showView('teacher-dashboard-view');
        } else {
            currentTeacher = null;
            loadClassesForStudentLogin();
            showView('login-view');
        }
    });

    // 教師登入
    teacherLoginBtn.addEventListener('click', () => {
        // *** 修改重點：改用 Compat 版本的 GoogleAuthProvider ***
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(result => {
                const user = result.user;
                const teacherRef = db.ref('teachers/' + user.uid);
                teacherRef.get().then(snapshot => {
                    if (!snapshot.exists()) {
                        teacherRef.set({
                            name: user.displayName,
                            email: user.email
                        });
                    }
                });
            }).catch(error => {
                // *** 修改重點：增強錯誤處理 ***
                console.error("Google 登入失敗:", error);
                if (error.code === 'auth/popup-blocked') {
                    alert("登入彈出視窗被您的瀏覽器阻擋了！請允許彈出視窗後再試一次。");
                } else if (error.code === 'auth/popup-closed-by-user') {
                    // 使用者自行關閉視窗，不需提示
                } else {
                    alert("Google 登入時發生錯誤，請查看主控台以獲取詳細資訊。");
                }
            });
    });

    // 登出
    logoutBtn.addEventListener('click', () => {
        auth.signOut();
    });

    // 學生登入
    studentLoginBtn.addEventListener('click', () => {
        const classId = classSelect.value;
        const seatNumber = document.getElementById('student-seat-number').value;

        if (!classId || !seatNumber) {
            alert('請選擇班級並輸入座號');
            return;
        }
        
        // *** 修改重點：改用 Compat 版本的 get() ***
        db.ref(`classes/${classId}/students/${seatNumber}`).get().then(snapshot => {
            if (snapshot.exists()) {
                currentStudent = { classId, seatNumber, name: snapshot.val() };
                alert(`歡迎 ${snapshot.val()} 同學！`);
                loadAndShowFirstPostForStudent(classId);
            } else {
                alert('座號錯誤或不存在，請重新輸入');
            }
        });
    });

    async function loadAndShowFirstPostForStudent(classId) {
        const postsQuery = db.ref('posts').orderByChild('classId').equalTo(classId);
        const snapshot = await postsQuery.get();
        if (snapshot.exists()) {
            const posts = snapshot.val();
            currentPostId = Object.keys(posts)[0];
            const postTitle = posts[currentPostId].title;
            document.getElementById('padlet-title').textContent = postTitle;
            loadMessages(currentPostId);
            showView('padlet-view');
        } else {
            alert("這個班級還沒有建立任何主題牆！");
        }
    }

    // 載入班級列表 (供學生登入用)
    function loadClassesForStudentLogin() {
        const classesRef = db.ref('classes');
        classesRef.on('value', (snapshot) => {
            classSelect.innerHTML = '<option value="">--- 請選擇班級 ---</option>';
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const option = document.createElement('option');
                    option.value = childSnapshot.key;
                    option.textContent = childSnapshot.val().className;
                    classSelect.appendChild(option);
                });
            }
        });
    }

    // ---- 教師功能 (大部分邏輯相同，僅修改 Firebase 語法) ----

    function loadTeacherDashboard() {
        const classesQuery = db.ref('classes').orderByChild('teacherId').equalTo(currentTeacher.uid);
        classesQuery.on('value', (snapshot) => {
            const classListDiv = document.getElementById('class-list');
            classListDiv.innerHTML = '';
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const classData = childSnapshot.val();
                    const classEl = document.createElement('div');
                    classEl.className = 'list-item clickable';
                    classEl.textContent = classData.className;
                    classEl.onclick = () => showClassManagement(childSnapshot.key, classData.className);
                    classListDiv.appendChild(classEl);
                });
            } else {
                classListDiv.innerHTML = '<p>您尚未建立任何班級。</p>';
            }
        });
    }

    createClassBtn.addEventListener('click', () => {
        const className = document.getElementById('new-class-name').value.trim();
        if (!className) return alert('請輸入班級名稱');
        
        const newClassRef = db.ref('classes').push();
        newClassRef.set({
            className: className,
            teacherId: currentTeacher.uid
        }).then(() => {
            document.getElementById('new-class-name').value = '';
        }).catch(error => console.error("建立班級失敗:", error));
    });

    function showClassManagement(classId, className) {
        currentClassId = classId;
        document.getElementById('manage-class-name').textContent = `管理班級: ${className}`;
        loadStudents(classId);
        loadPosts(classId);
        showView('class-management-view');
    }

    function loadStudents(classId) {
        const studentsRef = db.ref(`classes/${classId}/students`);
        studentsRef.on('value', (snapshot) => {
            const studentListDiv = document.getElementById('student-list');
            studentListDiv.innerHTML = '';
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const studentEl = document.createElement('div');
                    studentEl.className = 'list-item';
                    studentEl.textContent = `座號: ${childSnapshot.key}, 姓名: ${childSnapshot.val()}`;
                    studentListDiv.appendChild(studentEl);
                });
            } else {
                studentListDiv.innerHTML = '<p>尚未新增任何學生。</p>';
            }
        });
    }

    addStudentBtn.addEventListener('click', () => {
        const seat = document.getElementById('new-student-seat').value;
        const name = document.getElementById('new-student-name').value.trim();
        if (!seat || !name) return alert('請輸入座號和姓名');
        
        db.ref(`classes/${currentClassId}/students/${seat}`).set(name)
            .then(() => {
                document.getElementById('new-student-seat').value = '';
                document.getElementById('new-student-name').value = '';
            }).catch(error => console.error("新增學生失敗:", error));
    });

    function loadPosts(classId) {
        const postsQuery = db.ref('posts').orderByChild('classId').equalTo(classId);
        postsQuery.on('value', (snapshot) => {
            const postListDiv = document.getElementById('post-list');
            postListDiv.innerHTML = '';
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const postData = childSnapshot.val();
                    const postEl = document.createElement('div');
                    postEl.className = 'list-item clickable';
                    postEl.textContent = postData.title;
                    postEl.onclick = () => {
                        currentPostId = childSnapshot.key;
                        document.getElementById('padlet-title').textContent = postData.title;
                        loadMessages(currentPostId);
                        showView('padlet-view');
                    };
                    postListDiv.appendChild(postEl);
                });
            } else {
                postListDiv.innerHTML = '<p>尚未建立任何主題牆。</p>';
            }
        });
    }
    
    createPostBtn.addEventListener('click', () => {
        const title = document.getElementById('new-post-title').value.trim();
        if (!title) return alert('請輸入主題牆標題');

        const newPostRef = db.ref('posts').push();
        newPostRef.set({
            title: title,
            classId: currentClassId,
            createdAt: new Date().toISOString()
        }).then(() => {
            document.getElementById('new-post-title').value = '';
        }).catch(error => console.error("建立主題牆失敗:", error));
    });

    // ---- Padlet 主題牆功能 (大部分邏輯相同，僅修改 Firebase 語法) ----

    function loadMessages(postId) {
        const messagesRef = db.ref(`posts/${postId}/messages`);
        if (messagesListener) messagesRef.off('value', messagesListener);

        messagesListener = messagesRef.on('value', (snapshot) => {
            padletBoard.innerHTML = '';
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const msg = childSnapshot.val();
                    const card = createMessageCard(msg);
                    padletBoard.appendChild(card);
                });
            }
        });
    }
    
    // createMessageCard 函式和之前完全相同，無需修改
    function createMessageCard(msg) {
        const card = document.createElement('div');
        card.className = 'message-card';
        const header = document.createElement('div');
        header.className = 'card-header';
        header.textContent = `${msg.studentSeatNumber}. ${msg.studentName}`;
        const content = document.createElement('div');
        content.className = 'card-content';
        if (msg.text) {
            const p = document.createElement('p');
            p.textContent = msg.text;
            content.appendChild(p);
        }
        if (msg.imageUrl) {
            const img = document.createElement('img');
            img.src = msg.imageUrl;
            content.appendChild(img);
        }
        if (msg.fileUrl) {
            const a = document.createElement('a');
            a.href = msg.fileUrl;
            a.textContent = `檔案: ${msg.fileName}`;
            a.target = '_blank';
            content.appendChild(a);
        }
        const footer = document.createElement('div');
        footer.className = 'card-footer';
        footer.textContent = new Date(msg.timestamp).toLocaleString();
        card.appendChild(header);
        card.appendChild(content);
        card.appendChild(footer);
        return card;
    }

    // Modal 相關功能 (和之前相同)
    addMessageBtn.addEventListener('click', () => {
        if (!currentStudent) return alert("只有學生才能新增便利貼！");
        messageModal.style.display = 'block';
    });
    closeModalBtn.addEventListener('click', () => messageModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == messageModal) messageModal.style.display = 'none';
    });
    
    // 提交留言 (修改了 Firebase 語法)
    submitMessageBtn.addEventListener('click', async () => {
        const text = document.getElementById('message-text').value.trim();
        const imageFile = document.getElementById('message-image').files[0];
        const generalFile = document.getElementById('message-file').files[0];

        if (!text && !imageFile && !generalFile) return alert("請至少輸入文字、上傳圖片或檔案！");
        
        submitMessageBtn.disabled = true;
        const progressDiv = document.getElementById('upload-progress');
        progressDiv.style.display = 'block';
        progressDiv.textContent = '處理中...';

        try {
            let imageUrl = null, fileUrl = null, fileName = null;

            if (imageFile) {
                imageUrl = await uploadFile(imageFile, 'images', progressDiv);
            }
            if (generalFile) {
                const result = await uploadFile(generalFile, 'files', progressDiv);
                fileUrl = result.url;
                fileName = result.name;
            }
            
            const newMessageRef = db.ref(`posts/${currentPostId}/messages`).push();
            newMessageRef.set({
                studentSeatNumber: currentStudent.seatNumber,
                studentName: currentStudent.name,
                text: text || null,
                imageUrl: imageUrl || null,
                fileUrl: fileUrl || null,
                fileName: fileName || null,
                timestamp: new Date().toISOString()
            });

            document.getElementById('message-text').value = '';
            document.getElementById('message-image').value = '';
            document.getElementById('message-file').value = '';
            messageModal.style.display = 'none';

        } catch (error) {
            console.error("張貼失敗:", error);
            alert("張貼失敗，請稍後再試。");
        } finally {
            submitMessageBtn.disabled = false;
            progressDiv.style.display = 'none';
        }
    });

    // 檔案上傳函式 (修改了 Firebase 語法)
    function uploadFile(file, path, progressElement) {
        return new Promise((resolve, reject) => {
            const filePath = `${path}/${Date.now()}_${file.name}`;
            const fileStorageRef = storage.ref(filePath);
            const uploadTask = fileStorageRef.put(file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (progressElement) progressElement.textContent = `上傳中... ${Math.round(progress)}%`;
                },
                (error) => reject(error),
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        if (path === 'images') resolve(downloadURL);
                        else resolve({ url: downloadURL, name: file.name });
                    });
                }
            );
        });
    }

    // 返回按鈕事件 (和之前相同)
    document.querySelector('.back-to-dashboard').addEventListener('click', () => showView('teacher-dashboard-view'));
    document.getElementById('back-to-login-btn').addEventListener('click', () => {
        currentStudent = null;
        const messagesRef = db.ref(`posts/${currentPostId}/messages`);
        if (messagesListener) messagesRef.off('value', messagesListener);
        currentPostId = null;
        showView('login-view');
    });

});