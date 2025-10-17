export function createCanvas(id = "tetris", cols = 10, rows = 20) {
  const canvas = document.getElementById(id)
  const scale = canvas.width / cols
  canvas.height = rows * scale
  const ctx = canvas.getContext("2d")
  ctx.scale = scale
  return ctx
}

