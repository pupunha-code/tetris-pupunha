export function createCanvas(id = "tetris", cols = 10, rows = 20) {
  const canvas = document.getElementById(id)
  // Board is 10 cols * 40px = 400px, with 150px margins on each side = 700px total
  const scale = 40
  canvas.height = rows * scale
  const ctx = canvas.getContext("2d")
  ctx.scale = scale
  ctx.boardOffsetX = 150 // Offset to center the board
  return ctx
}

