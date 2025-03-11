// Game state for each player
const players = {
  'player-one': {
    currentAnswer: null,
    score: 0,
    questionCount: 0,
    isAnswering: false
  },
  'player-two': {
    currentAnswer: null,
    score: 0,
    questionCount: 0,
    isAnswering: false
  }
};

const encouragements = [
  "太棒了！繼續保持！",
  "完全正確！你真厲害！",
  "好極了！你已經掌握訣竅了！",
  "太神了！你是數學天才！",
  "答對了！你真是太聰明了！"
];

const consolations = [
  "加油！下一題你一定可以的！",
  "沒關係，數學需要練習！",
  "繼續努力，你會越來越好！",
  "別氣餒，下次會成功的！",
  "錯誤是學習的一部分，繼續加油！"
];

function generateQuestion(playerId) {
  const player = players[playerId];
  
  if (player.score >= 100) {
    alert(`${playerId === 'player-one' ? '左邊' : '右邊'}玩家恭喜你集滿100分！遊戲結束！`);
    // 重置遊戲
    player.score = 0;
    player.questionCount = 0;
    document.getElementById(`score-${playerId}`).textContent = `分數：${player.score}`;
  }

  // 重置答題狀態
  player.isAnswering = false;
  enableButtons(true, playerId);

  // 生成隨機係數 (-10 到 10，不含0)
  const getRandomCoef = () => {
    let num = Math.floor(Math.random() * 20) - 10;
    return num === 0 ? 1 : num;
  };

  // 生成方程式係數 (確保有整數解)
  const a1 = getRandomCoef();
  const b1 = getRandomCoef();
  const a2 = getRandomCoef();
  const b2 = getRandomCoef();

  // 先決定x和y的解 (使用小的整數)
  const x = Math.floor(Math.random() * 11) - 5;  // -5 到 5
  const y = Math.floor(Math.random() * 11) - 5;  // -5 到 5

  // 計算等號右邊的常數
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;

  // 隨機決定求解x還是y
  const solveForX = Math.random() < 0.5;
  
  // 根據要求解的變數設定答案
  const answer = solveForX ? x : y;
  
  // 生成不重複的選項
  const generateUniqueOptions = (correctAnswer) => {
    const options = [correctAnswer];
    
    // 確保生成的選項不重複
    while (options.length < 4) {
      // 生成與答案不同的偏移量
      let offset;
      do {
        offset = Math.floor(Math.random() * 11) - 5; // -5 到 5 的偏移
      } while (offset === 0);
      
      const newOption = correctAnswer + offset;
      
      // 確保新選項不重複
      if (!options.includes(newOption)) {
        options.push(newOption);
      }
    }
    
    // 隨機排序選項
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
  };
  
  const options = generateUniqueOptions(answer);
  player.currentAnswer = options.indexOf(answer);

  // 顯示題目
  const formatEquation = (a, b, c) => {
    let equation = "";
    
    // 處理x項
    if (a === 1) {
      equation = `x `;
    } else if (a === -1) {
      equation = `-x `;
    } else {
      equation = `${a}x `;
    }
    
    // 處理y項
    if (b !== 0) {
      if (b === 1) {
        equation += `+ y`;
      } else if (b === -1) {
        equation += `- y`;
      } else if (b > 0) {
        equation += `+ ${b}y`;
      } else {
        equation += `- ${Math.abs(b)}y`;
      }
    }
    
    equation += ` = ${c}`;
    return equation;
  };

  // 顯示題目
  const equationsElement = document.getElementById(`equations-${playerId}`);
  equationsElement.innerHTML = `
    ${formatEquation(a1, b1, c1)}<br>
    ${formatEquation(a2, b2, c2)}
  `;
  
  const questionElement = document.getElementById(`question-${playerId}`);
  questionElement.innerHTML = solveForX ? `求 x = ?` : `求 y = ?`;

  // 更新選項按鈕文字
  const buttons = document.querySelectorAll(`.${playerId} .options button`);
  options.forEach((option, index) => {
    buttons[index].textContent = `${String.fromCharCode(65 + index)}: ${option}`;
  });

  // 清除回饋訊息
  document.getElementById(`feedback-${playerId}`).textContent = '';
  document.getElementById(`feedback-${playerId}`).className = 'feedback';
}

function enableButtons(enable, playerId) {
  const buttons = document.querySelectorAll(`.${playerId} .options button`);
  buttons.forEach(button => {
    button.disabled = !enable;
  });
}

function checkAnswer(selectedIndex, playerId) {
  const player = players[playerId];
  
  if (player.score >= 100 || player.isAnswering) return;
  
  player.isAnswering = true;
  enableButtons(false, playerId);
  
  const feedbackElement = document.getElementById(`feedback-${playerId}`);
  const container = document.querySelector(`.${playerId}`);
  
  if (selectedIndex === player.currentAnswer) {
    feedbackElement.textContent = encouragements[Math.floor(Math.random() * encouragements.length)];
    feedbackElement.className = 'feedback correct';
    player.score += 20;
    player.questionCount++;
    document.getElementById(`score-${playerId}`).textContent = `分數：${player.score}`;
    
    // 閃爍效果
    container.classList.add('flashing');
    setTimeout(() => {
      container.classList.remove('flashing');
      if (player.score < 100) {
        generateQuestion(playerId);
      } else {
        setTimeout(() => {
          alert(`${playerId === 'player-one' ? '左邊' : '右邊'}玩家恭喜你集滿100分！遊戲結束！`);
        }, 500);
      }
    }, 1000);
  } else {
    feedbackElement.textContent = `答錯了！正確答案是 ${String.fromCharCode(65 + player.currentAnswer)}。${consolations[Math.floor(Math.random() * consolations.length)]}`;
    feedbackElement.className = 'feedback incorrect';
    
    // 3秒後顯示下一題
    setTimeout(() => {
      generateQuestion(playerId);
    }, 3000);
  }
}

// 頁面載入時生成第一題
window.onload = function() {
  generateQuestion('player-one');
  generateQuestion('player-two');
};