export function createCanvas(id = "tetris", cols = 10, rows = 20, scale = 20) {
  const canvas = document.getElementById(id)
  canvas.width = cols * scale
  canvas.height = rows * scale
  const ctx = canvas.getContext("2d")
  return ctx
}

export function updateHUD(score, gameOver = false) {
  document.getElementById("score").textContent = `Score: ${score}`
  
  if (gameOver) {
    const gameOverElement = document.getElementById("game-over") || createGameOverElement();
    gameOverElement.style.display = "block";
  } else {
    const gameOverElement = document.getElementById("game-over");
    if (gameOverElement) {
      gameOverElement.style.display = "none";
    }
  }
}

function createGameOverElement() {
  const gameOverDiv = document.createElement("div");
  gameOverDiv.id = "game-over";
  gameOverDiv.innerHTML = `
    <div class="game-over-content">
      <h2 class="game-over-title">💀 GAME OVER 💀</h2>
      <div class="game-over-subtitle">Pupunha foi derrotada!</div>
      <div class="game-over-instructions">
        <div class="restart-instruction">🔄 Pressione <kbd>R</kbd> para reiniciar</div>
        <div class="pause-instruction">⏸️ Pressione <kbd>P</kbd> para pausar</div>
      </div>
    </div>
  `;
  gameOverDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  `;
  
  // Add styles for the inner content
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .game-over-content {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d1b1b 100%);
      border: 3px solid #ff4444;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(255, 68, 68, 0.3);
      transform: scale(1);
      animation: pulse 2s infinite;
      max-width: 500px;
      width: 90%;
    }
    
    @keyframes pulse {
      0%, 100% { box-shadow: 0 20px 60px rgba(255, 68, 68, 0.3); }
      50% { box-shadow: 0 20px 80px rgba(255, 68, 68, 0.5); }
    }
    
    .game-over-title {
      font-size: 3rem;
      font-weight: bold;
      color: #ff4444;
      margin: 0 0 15px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      font-family: 'Courier New', monospace;
    }
    
    .game-over-subtitle {
      font-size: 1.2rem;
      color: #ffaa44;
      margin-bottom: 30px;
      font-style: italic;
    }
    
    .game-over-instructions {
      font-size: 1rem;
      color: #ffffff;
      line-height: 1.8;
    }
    
    .restart-instruction, .pause-instruction {
      margin: 10px 0;
      padding: 8px 0;
    }
    
    kbd {
      background: #333;
      border: 2px solid #555;
      border-radius: 6px;
      padding: 4px 8px;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      color: #00ff88;
      margin: 0 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  `;
  
  if (!document.getElementById('game-over-styles')) {
    style.id = 'game-over-styles';
    document.head.appendChild(style);
  }
  
  document.body.appendChild(gameOverDiv);
  return gameOverDiv;
}

