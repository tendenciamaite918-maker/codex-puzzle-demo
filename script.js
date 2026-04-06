const SIZE = 3;
const EMPTY = 0;
const SOLVED_STATE = [1, 2, 3, 4, 5, 6, 7, 8, EMPTY];

const puzzleEl = document.getElementById('puzzle');
const stepCountEl = document.getElementById('step-count');
const restartBtn = document.getElementById('restart-btn');

let board = [];
let steps = 0;

/**
 * 生成一个可解且非完成态的随机棋盘。
 */
function generateSolvableBoard() {
  const arr = [...SOLVED_STATE];

  do {
    // Fisher-Yates 洗牌
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (!isSolvable(arr) || isSolved(arr));

  return arr;
}

/**
 * 3x3 拼图可解判断：逆序数必须为偶数。
 */
function isSolvable(state) {
  let inversions = 0;
  const numbers = state.filter((n) => n !== EMPTY);

  for (let i = 0; i < numbers.length - 1; i += 1) {
    for (let j = i + 1; j < numbers.length; j += 1) {
      if (numbers[i] > numbers[j]) {
        inversions += 1;
      }
    }
  }

  return inversions % 2 === 0;
}

function isSolved(state = board) {
  return state.every((num, idx) => num === SOLVED_STATE[idx]);
}

function getNeighborIndexes(emptyIndex) {
  const neighbors = [];
  const row = Math.floor(emptyIndex / SIZE);
  const col = emptyIndex % SIZE;

  if (row > 0) neighbors.push(emptyIndex - SIZE);
  if (row < SIZE - 1) neighbors.push(emptyIndex + SIZE);
  if (col > 0) neighbors.push(emptyIndex - 1);
  if (col < SIZE - 1) neighbors.push(emptyIndex + 1);

  return neighbors;
}

function render() {
  puzzleEl.innerHTML = '';

  board.forEach((value, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = `tile ${value === EMPTY ? 'empty' : ''}`;

    // 空白格不显示数字，也不响应点击
    tile.textContent = value === EMPTY ? '' : String(value);
    tile.disabled = value === EMPTY;

    tile.addEventListener('click', () => tryMove(index));
    puzzleEl.appendChild(tile);
  });

  stepCountEl.textContent = String(steps);
}

function tryMove(tileIndex) {
  const emptyIndex = board.indexOf(EMPTY);
  const movableIndexes = getNeighborIndexes(emptyIndex);

  if (!movableIndexes.includes(tileIndex)) {
    return;
  }

  [board[emptyIndex], board[tileIndex]] = [board[tileIndex], board[emptyIndex]];
  steps += 1;
  render();

  if (isSolved()) {
    // 延迟一帧后弹窗，让最后一步渲染先完成
    setTimeout(() => {
      window.alert(`恭喜通关！你一共用了 ${steps} 步。`);
    }, 50);
  }
}

function restartGame() {
  board = generateSolvableBoard();
  steps = 0;
  render();
}

restartBtn.addEventListener('click', restartGame);

// 初次加载时自动开始一局
restartGame();
