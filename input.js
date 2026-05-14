// =============================================================
//  input.js — Keyboard Input State
//  Tracks which movement keys are currently held down.
//  Read inputState.up / .down / .left / .right anywhere in the
//  game loop — no polling, no event passing needed.
// =============================================================

// ------------------------------------------------------------------
//  inputState
//  Each flag is true while its key is held, false otherwise.
// ------------------------------------------------------------------
const inputState = {
  up:    false,
  down:  false,
  left:  false,
  right: false,
};

// ------------------------------------------------------------------
//  Arrow keys that should not scroll the page.
// ------------------------------------------------------------------
const SCROLL_KEYS = new Set([
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
]);

// ------------------------------------------------------------------
//  _applyKey(code, active)
//  Shared logic for keydown and keyup — maps a KeyboardEvent.code
//  to the correct inputState flag and sets it to `active`.
// ------------------------------------------------------------------
function _applyKey(code, active) {
  switch (code) {
    case "ArrowUp":    // fall-through
    case "KeyW":       inputState.up    = active; break;

    case "ArrowDown":  // fall-through
    case "KeyS":       inputState.down  = active; break;

    case "ArrowLeft":  // fall-through
    case "KeyA":       inputState.left  = active; break;

    case "ArrowRight": // fall-through
    case "KeyD":       inputState.right = active; break;
  }
}

// ------------------------------------------------------------------
//  Keydown — mark key as held and suppress browser scroll.
// ------------------------------------------------------------------
window.addEventListener("keydown", (e) => {
  if (SCROLL_KEYS.has(e.code)) {
    e.preventDefault(); // prevent page scrolling on arrow keys
  }
  _applyKey(e.code, true);
});

// ------------------------------------------------------------------
//  Keyup — mark key as released.
// ------------------------------------------------------------------
window.addEventListener("keyup", (e) => {
  _applyKey(e.code, false);
});
