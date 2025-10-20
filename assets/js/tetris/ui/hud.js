export function updateHUD(score, gameOver = false) {
  document.getElementById("score").textContent = `Score: ${score}`

  const gameOverElement = document.getElementById("game-over");
  if (gameOverElement) {
    if (gameOver) {
      gameOverElement.classList.remove("hidden");
    } else {
      gameOverElement.classList.add("hidden");
    }
  }
}

