export function startGameLoop(updateFn, getSpeed = () => 300) {
  function loop() {
    updateFn()
    setTimeout(loop, getSpeed())
  }
  loop()
}

