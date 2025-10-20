import { clearLines, createBoard, merge } from "./core/board.js";
import { randomPiece, rotateLeft, rotateRight } from "./core/piece.js";
import { collide } from "./core/collision.js";
import { drawBoard, drawGhost, drawHoldPiece, drawNextQueue, drawPiece } from "./systems/renderer.js";
import { registerControls } from "./systems/input.js";
import { updateScore } from "./systems/scoring.js";
import { createCanvas } from "./ui/canvas.js";
import { updateHUD } from "./ui/hud.js";
import { audioSystem } from "./systems/audio.js";
import { animationSystem } from "./systems/animation.js";

const ctx = createCanvas();
let board = createBoard();
let piece = randomPiece();
let score = 0;
let paused = false;
let gameStarted = false;
let gameOver = false;

let holdPiece = null;
let canHold = true;
let nextQueue = [];
const QUEUE_SIZE = 5;

for (let i = 0; i < QUEUE_SIZE; i++) {
  nextQueue.push(randomPiece());
}

function checkGameOver() {
  return collide(board, piece);
}

function spawnNewPiece() {
  piece = nextQueue.shift();
  piece.x = 3;
  piece.y = 0;

  nextQueue.push(randomPiece());

  canHold = true;

  if (checkGameOver()) {
    gameOver = true;
    paused = true;
    audioSystem.pauseMusic();
    audioSystem.playSound('gameOver');
    updateHUD(score, true);
    console.log('Game Over!');
  }
}

function drop() {
  const oldY = piece.y;
  piece.y++;

  if (collide(board, piece)) {
    piece.y = oldY;
    merge(board, piece);
    audioSystem.playSound('blockFix');
    const cleared = clearLines(board);
    if (cleared > 0) {
      audioSystem.playSound('scored');
    }
    score = updateScore(score, cleared);
    updateHUD(score);
    spawnNewPiece();
  } else {
    // Peça cair automaticamente
    animationSystem.animateDrop(piece, oldY, piece.y, 60);
  }
}

function hardDrop() {
  while (!collide(board, piece)) piece.y++;
  piece.y--;
  merge(board, piece);
  audioSystem.playSound('blockFix');
  const cleared = clearLines(board);
  if (cleared > 0) {
    audioSystem.playSound('scored');
  }
  score = updateScore(score, cleared);
  updateHUD(score);
  spawnNewPiece();
}

function holdCurrentPiece() {
  if (!canHold) return;

  if (holdPiece === null) {
    holdPiece = { ...piece };
    spawnNewPiece();
  } else {
    let temp = { ...piece };
    piece = { ...holdPiece };
    piece.x = 3;
    piece.y = 0;
    holdPiece = temp;
  }

  canHold = false;
}

function resetGame() {
  board = createBoard();
  piece = nextQueue.shift();
  piece.x = 3;
  piece.y = 0;
  nextQueue.push(randomPiece());

  score = 0;
  gameOver = false;
  paused = false;
  holdPiece = null;
  canHold = true;

  while (nextQueue.length < QUEUE_SIZE) {
    nextQueue.push(randomPiece());
  }

  updateHUD(score);
}

function startGame() {
  console.log('Start game called!');
  gameStarted = true;
  const button = document.getElementById('start-button');
  if (button) {
    button.style.display = 'none';
  }
  audioSystem.playMusic();
  resetGame();
  audioSystem.playMusic();

}

// Make function available globally as backup
window.startTetrisGame = startGame;

// Pra rotacionar a peca na direita
function tryRotate(direction) {
  if (animationSystem.hasActiveAnimations()) return;

  const rotated = direction === 'right' ? rotateRight(piece) : rotateLeft(piece);

  const kicks = [0, -1, 1, -2, 2];

  for (const kick of kicks) {
    const tempPiece = { ...rotated, x: piece.x + kick };

    if (!collide(board, tempPiece)) {
      animationSystem.cancelMovementAnimations();

      const oldShape = piece.shape;

      piece.x = tempPiece.x;
      piece.shape = rotated.shape;

      piece.renderX = piece.x;

      animationSystem.animateRotation(piece, oldShape, piece.shape);
      return;
    }
  }
}

registerControls({
  left: () => {
    // Cancela movimento anterior se houver
    animationSystem.cancelMovementAnimations();

    const oldX = piece.x;
    piece.x--;
    if (collide(board, piece)) {
      piece.x = oldX;
    } else {
      // Animação super rápida e não-bloqueante
      animationSystem.animateMovement(piece, oldX, piece.x, 40);
    }
  },
  right: () => {
    // Cancela movimento anterior se houver
    animationSystem.cancelMovementAnimations();

    const oldX = piece.x;
    piece.x++;
    if (collide(board, piece)) {
      piece.x = oldX;
    } else {
      // Animação super rápida e não-bloqueante
      animationSystem.animateMovement(piece, oldX, piece.x, 40);
    }
  },
  down: () => drop(),
  up: () => hardDrop(),
  rotateRight: () => tryRotate('right'),
  rotateLeft: () => tryRotate('left'),
  pause: () => {
    paused = !paused;
    if (paused) {
      audioSystem.pauseMusic();
      animationSystem.cancelAllAnimations();
    } else {
      audioSystem.playMusic();
    }
  },
  reset: () => {
    animationSystem.cancelAllAnimations();
    resetGame();
  },
  hold: () => {
    holdCurrentPiece();
  },
});

function update() {
  if (gameStarted && !paused) {
    drawBoard(ctx, board, ctx.scale)
    drawGhost(ctx, piece, board, ctx.scale)
    drawPiece(ctx, piece, ctx.scale)

    // Hold piece on the left (before board offset)
    drawHoldPiece(ctx, holdPiece, canHold, 10, 50)
    // Next queue on the right (after board + board width)
    const boardEndX = ctx.boardOffsetX + (10 * ctx.scale)
    drawNextQueue(ctx, nextQueue, boardEndX + 10, 50)
  }
}

let lastDropTime = 0;
const dropInterval = 500;

function gameUpdate(currentTime) {
  if (gameStarted && !paused && !gameOver && !animationSystem.hasActiveAnimations()) {
    if (currentTime - lastDropTime >= dropInterval) {
      drop();
      lastDropTime = currentTime;
    }
  }

  update();
  requestAnimationFrame(gameUpdate);
}

requestAnimationFrame(gameUpdate);

window.addEventListener('load', () => {
  console.log('Window loaded, binding start button');
  const button = document.getElementById('start-button');
  if (button) {
    console.log('Start button found, adding event listener');
    button.addEventListener('click', startGame);
    button.onclick = startGame;
  } else {
    console.error('Start button not found!');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, trying to bind start button');
  const button = document.getElementById('start-button');
  if (button) {
    console.log('Start button found in DOMContentLoaded');
    button.addEventListener('click', startGame);
  }
});

