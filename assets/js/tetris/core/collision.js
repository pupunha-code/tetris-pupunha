export function collide(board, piece) {
  return piece.shape.some((row, dy) =>
    row.some((cell, dx) => {
      if (!cell) return false
      const y = piece.y + dy
      const x = piece.x + dx
      return y >= board.length || y < 0 || x < 0 || x >= board[0].length || (y >= 0 && board[y][x])
    })
  )
}

