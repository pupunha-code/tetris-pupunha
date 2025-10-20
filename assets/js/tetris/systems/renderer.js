import { collide } from "../core/collision.js"



export function drawBoard(ctx, board, scale = 30) {
  const width = board[0].length * scale
  const height = board.length * scale
  const offsetX = ctx.boardOffsetX || 0

  const gradient = ctx.createLinearGradient(offsetX, 0, offsetX, height)
  gradient.addColorStop(0, "#1e1e1e")
  gradient.addColorStop(0.5, "#141414")
  gradient.addColorStop(1, "#0a0a0a")
  ctx.fillStyle = gradient
  ctx.fillRect(offsetX, 0, width, height)

  ctx.strokeStyle = "#333"
  ctx.lineWidth = 0.5
  ctx.globalAlpha = 0.3

  for (let x = 0; x <= board[0].length; x++) {
    ctx.beginPath()
    ctx.moveTo(offsetX + x * scale + 0.5, 0)
    ctx.lineTo(offsetX + x * scale + 0.5, height)
    ctx.stroke()
  }
  for (let y = 0; y <= board.length; y++) {
    ctx.beginPath()
    ctx.moveTo(offsetX, y * scale + 0.5)
    ctx.lineTo(offsetX + width, y * scale + 0.5)
    ctx.stroke()
  }

  ctx.globalAlpha = 1

  board.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell) {
        const color = typeof cell === 'string' ? cell : "#05f5fc"
        drawBlock(ctx, x, y, scale, color, offsetX)
      }
    })
  )
}

export function drawPiece(ctx, piece, scale = 30, color = null) {
  const pieceColor = color || piece.color || "#05f5fc"
  const offsetX = ctx.boardOffsetX || 0

  const renderX = piece.renderX !== undefined ? piece.renderX : piece.x
  const renderY = piece.renderY !== undefined ? piece.renderY : piece.y

  if (piece.rotationProgress > 0) {
    ctx.save()
    const centerX = offsetX + (renderX + piece.shape[0].length / 2) * scale
    const centerY = (renderY + piece.shape.length / 2) * scale

    ctx.translate(centerX, centerY)
    ctx.rotate((piece.rotationProgress * Math.PI) / 2)
    ctx.translate(-centerX, -centerY)
  }

  piece.shape.forEach((row, dy) =>
    row.forEach((cell, dx) => {
      if (cell) {
        drawBlock(ctx, renderX + dx, renderY + dy, scale, pieceColor, offsetX)
      }
    })
  )

  if (piece.rotationProgress > 0) {
    ctx.restore()
  }
}

export function drawGhost(ctx, piece, board, scale = 30) {
  const ghost = { ...piece, y: piece.y }
  const offsetX = ctx.boardOffsetX || 0

  while (!collide(board, ghost)) {
    ghost.y++
  }
  ghost.y--

  ghost.shape.forEach((row, dy) =>
    row.forEach((cell, dx) => {
      if (cell) {
        drawBlock(ctx, ghost.x + dx, ghost.y + dy, scale, "rgba(255,255,255,0.15)", offsetX)
      }
    })
  )
}

function drawBlock(ctx, x, y, scale, color, offsetX = 0) {
  const px = offsetX + x * scale
  const py = y * scale
  const size = scale - 2

  const mainGrad = ctx.createLinearGradient(px, py, px + size, py + size)
  mainGrad.addColorStop(0, lighten(color, 0.3))
  mainGrad.addColorStop(0.5, color)
  mainGrad.addColorStop(1, darken(color, 0.3))

  ctx.fillStyle = mainGrad
  ctx.fillRect(px + 1, py + 1, size, size)

  ctx.fillStyle = lighten(color, 0.5)
  ctx.fillRect(px + 1, py + 1, size, 2)
  ctx.fillRect(px + 1, py + 1, 2, size)

  ctx.fillStyle = darken(color, 0.5)
  ctx.fillRect(px + size - 1, py + 3, 2, size - 2)
  ctx.fillRect(px + 3, py + size - 1, size - 2, 2)

  ctx.strokeStyle = "rgba(0,0,0,0.2)"
  ctx.lineWidth = 1
  ctx.strokeRect(px + 1, py + 1, size, size)
}

function lighten(color, amt) {
  const c = parseInt(color.slice(1), 16)
  let r = (c >> 16) + Math.round(255 * amt)
  let g = ((c >> 8) & 0x00ff) + Math.round(255 * amt)
  let b = (c & 0x0000ff) + Math.round(255 * amt)
  r = Math.min(255, Math.max(0, r))
  g = Math.min(255, Math.max(0, g))
  b = Math.min(255, Math.max(0, b))
  return `rgb(${r},${g},${b})`
}

function darken(color, amt) {
  const c = parseInt(color.slice(1), 16)
  let r = (c >> 16) - Math.round(255 * amt)
  let g = ((c >> 8) & 0x00ff) - Math.round(255 * amt)
  let b = (c & 0x0000ff) - Math.round(255 * amt)
  r = Math.min(255, Math.max(0, r))
  g = Math.min(255, Math.max(0, g))
  b = Math.min(255, Math.max(0, b))
  return `rgb(${r},${g},${b})`
}

export function drawHoldPiece(ctx, holdPiece, canHold, x, y, scale = 20) {
  ctx.fillStyle = "rgba(0,0,0,0.7)"
  ctx.fillRect(x, y, scale * 6, scale * 4)

  ctx.strokeStyle = canHold ? "#00ff00" : "#666666"
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, scale * 6, scale * 4)

  ctx.fillStyle = "#ffffff"
  ctx.font = "12px monospace"
  ctx.fillText("HOLD", x + 5, y - 5)

  if (holdPiece) {
    const alpha = canHold ? 1 : 0.5
    ctx.globalAlpha = alpha

    const pieceWidth = holdPiece.shape[0].length
    const pieceHeight = holdPiece.shape.length
    const centerX = x + (6 * scale - pieceWidth * scale) / 2
    const centerY = y + (4 * scale - pieceHeight * scale) / 2

    holdPiece.shape.forEach((row, dy) =>
      row.forEach((cell, dx) => {
        if (cell) {
          drawBlock(ctx, (centerX + dx * scale) / scale, (centerY + dy * scale) / scale, scale, holdPiece.color)
        }
      })
    )

    ctx.globalAlpha = 1
  }
}

export function drawNextQueue(ctx, nextQueue, x, y, scale = 15) {
  ctx.fillStyle = "rgba(0,0,0,0.7)"
  ctx.fillRect(x, y, scale * 6, scale * 20)

  ctx.strokeStyle = "#0099ff"
  ctx.lineWidth = 2
  ctx.strokeRect(x, y, scale * 6, scale * 20)

  ctx.fillStyle = "#ffffff"
  ctx.font = "12px monospace"
  ctx.fillText("NEXT", x + 5, y - 5)

  let currentY = y + 10
  nextQueue.slice(0, 5).forEach((piece, index) => {
    const alpha = index === 0 ? 1 : 0.7 - (index * 0.1)
    ctx.globalAlpha = alpha

    const pieceWidth = piece.shape[0].length
    const centerX = x + (6 * scale - pieceWidth * scale) / 2
    const sectionHeight = scale * 3.5

    piece.shape.forEach((row, dy) =>
      row.forEach((cell, dx) => {
        if (cell) {
          drawBlock(ctx, (centerX + dx * scale) / scale, (currentY + dy * scale) / scale, scale, piece.color)
        }
      })
    )

    currentY += sectionHeight
  })

  ctx.globalAlpha = 1
}
