export function updateScore(score, clearedLines) {
  const points = [0, 40, 100, 300, 1200]
  return score + (points[clearedLines] || 0)
}

export function getLevel(score) {
  return Math.floor(score / 1000) + 1
}

export function getSpeed(level) {
  return Math.max(50, 400 - (level * 30))
}

