export function createBoard(rows = 20, cols = 10) {
  return Array.from({ length: rows }, () => Array(cols).fill(0))
}

export function merge(board, piece) {
  piece.shape.forEach((row, dy) =>
    row.forEach((cell, dx) => {
      if (cell && board[piece.y + dy]) {
        board[piece.y + dy][piece.x + dx] = piece.color || 1
      }
    })
  )
}

export function clearLines(board) {
  let cleared = 0
  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y].every((c) => c)) {
      board.splice(y, 1)
      board.unshift(Array(board[0].length).fill(0))
      cleared++
      y++
    }
  }
  return cleared
}

