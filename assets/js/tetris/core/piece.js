import { SHAPES, PIECE_COLORS } from "./shapes.js"

export function randomPiece() {
  const keys = Object.keys(SHAPES)
  const type = keys[Math.floor(Math.random() * keys.length)]
  return {
    shape: SHAPES[type],
    x: 3,
    y: 0,
    type,
    color: PIECE_COLORS[type],
  }
}

export function rotateRight(piece) {
  const s = piece.shape
  const rotated = s[0].map((_, i) => s.map(row => row[i]).reverse())
  return { ...piece, shape: rotated }
}

export function rotateLeft(piece) {
  const s = piece.shape
  const rotated = s[0].map((_, i) => s.map(row => row[row.length - 1 - i]))
  return { ...piece, shape: rotated }
}

