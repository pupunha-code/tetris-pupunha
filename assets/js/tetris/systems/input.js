export function registerControls(callbacks) {
  const keys = {};
  const repeatDelay = 120;

  document.addEventListener("keydown", (e) => {
    e.preventDefault();
    const key = e.key.toLowerCase();

    if (keys[key]) return;

    keys[key] = {
      pressed: true,
      firstPress: true,
      lastAction: performance.now()
    };

    executeAction(key, callbacks);
    keys[key].firstPress = false;
  });

  document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    delete keys[key];
  });

  function handleKeyRepeat() {
    const now = performance.now();

    Object.entries(keys).forEach(([key, state]) => {
      if (state.pressed && !state.firstPress) {
        const timeSinceLastAction = now - state.lastAction;

        if ((key === "h" || key === "l" || key === "j" ||
          key === "arrowleft" || key === "arrowright" || key === "arrowdown" ||
          key === "a" || key === "d" || key === "s") &&
          timeSinceLastAction >= repeatDelay) {

          executeAction(key, callbacks);
          state.lastAction = now;
        }
      }
    });

    requestAnimationFrame(handleKeyRepeat);
  }

  requestAnimationFrame(handleKeyRepeat);

  function executeAction(key, callbacks) {
    if (key === "h" || key === "arrowleft" || key === "a") {
      callbacks.left();
    } else if (key === "l" || key === "arrowright" || key === "d") {
      callbacks.right();
    } else if (key === "j" || key === "arrowdown" || key === "s") {
      callbacks.down();
    } else if (key === "k" || key === "arrowup" || key === "w") {
      callbacks.up();
    } else if (key === "x" || key === " ") {
      callbacks.rotateRight();
    } else if (key === "z" || key === "shift") {
      callbacks.rotateLeft();
    } else if (key === "p" || key === "escape") {
      callbacks.pause?.();
    } else if (key === "r") {
      callbacks.reset?.();
    } else if (key === "c") {
      callbacks.hold?.();
    }
  }
}









