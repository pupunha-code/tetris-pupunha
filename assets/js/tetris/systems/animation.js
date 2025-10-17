export class AnimationSystem {
  constructor() {
    this.activeAnimations = new Map()
    this.animationSpeed = 60
    this.rotationSpeed = 80
    this.allowConcurrentMovement = true
  }

  animateMovement(piece, fromX, toX, duration = this.animationSpeed) {
    const animId = 'movement'

    return new Promise(resolve => {
      const startTime = performance.now()
      const distance = toX - fromX

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeOut = 1 - Math.pow(1 - progress, 3)

        piece.renderX = fromX + (distance * easeOut)

        if (progress < 1) {
          this.activeAnimations.set(animId, requestAnimationFrame(animate))
        } else {
          piece.renderX = toX
          piece.x = toX
          this.activeAnimations.delete(animId)
          resolve()
        }
      }

      this.activeAnimations.set(animId, requestAnimationFrame(animate))
    })
  }

  animateRotation(piece, fromShape, toShape, duration = this.rotationSpeed) {
    const animId = 'rotation'

    return new Promise(resolve => {
      const startTime = performance.now()

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeInOut = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress

        piece.rotationProgress = easeInOut

        if (progress < 1) {
          this.activeAnimations.set(animId, requestAnimationFrame(animate))
        } else {
          piece.shape = toShape
          piece.rotationProgress = 0
          this.activeAnimations.delete(animId)
          resolve()
        }
      }

      this.activeAnimations.set(animId, requestAnimationFrame(animate))
    })
  }

  animateDrop(piece, fromY, toY, duration = 200) {
    const animId = 'drop'

    return new Promise(resolve => {
      const startTime = performance.now()
      const distance = toY - fromY

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const easeIn = progress * progress

        piece.renderY = fromY + (distance * easeIn)

        if (progress < 1) {
          this.activeAnimations.set(animId, requestAnimationFrame(animate))
        } else {
          piece.renderY = toY
          piece.y = toY
          this.activeAnimations.delete(animId)
          resolve()
        }
      }

      this.activeAnimations.set(animId, requestAnimationFrame(animate))
    })
  }

  cancelAllAnimations() {
    this.activeAnimations.forEach(animationId => {
      cancelAnimationFrame(animationId)
    })
    this.activeAnimations.clear()
  }

  hasActiveAnimations() {
    return this.activeAnimations.has('rotation')
  }

  hasActiveMovement() {
    return this.activeAnimations.has('movement') || this.activeAnimations.has('drop')
  }

  cancelMovementAnimations() {
    ['movement', 'drop'].forEach(animId => {
      if (this.activeAnimations.has(animId)) {
        cancelAnimationFrame(this.activeAnimations.get(animId))
        this.activeAnimations.delete(animId)
      }
    })
  }
}

export const animationSystem = new AnimationSystem()
