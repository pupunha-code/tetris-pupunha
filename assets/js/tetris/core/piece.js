import {PIECE_COLORS, SHAPES} from "./shapes.js"

let bag = []

function refillBag() {
    const keys = Object.keys(SHAPES)
    bag = keys.sort(() => Math.random() - 0.5)
}

// Tetris usa bag pra rodar as pecas antes de gerar uma nova
export function randomPiece() {
    if (bag.length === 0) refillBag()
    const type = bag.pop()
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
    const transposed = s[0].map((_, colIndex) => s.map(row => row[colIndex]))
    const rotated = transposed.map(row => row.reverse())
    return {...piece, shape: rotated}
}

export function rotateLeft(piece) {
    const s = piece.shape
    const reversedRows = s.map(row => [...row].reverse())
    const rotated = reversedRows[0].map((_, colIndex) => reversedRows.map(row => row[colIndex]))
    return {...piece, shape: rotated}
}

