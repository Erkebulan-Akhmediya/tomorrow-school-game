// =============================================================
//  internal_conf.js — Internal Game Constants
//  NOT intended for student editing.
//  Contains values that are fixed by the game design and should
//  not be exposed as student-configurable options.
// =============================================================

const INTERNAL_CONFIG = {

  player: {
    // Display size of the player sprite in pixels (width & height).
    size: 64,

    // Time in seconds to display each frame of the walking animation.
    animationFrameDuration: 0.2,
  },

  enemy: {
    // Display size of each enemy sprite in pixels (width & height).
    size: 48,

    // Maximum pixel distance at which the player will auto-shoot
    // at a nearby enemy.
    detectionRange: 400,

    // Time in seconds to display each frame of the walking animation.
    animationFrameDuration: 0.2,
  },

  // Fixed canvas dimensions to prevent background stretching.
  canvasWidth: 1000,

};
