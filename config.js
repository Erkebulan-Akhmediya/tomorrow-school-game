// =============================================================
//  config.js — Game Configuration
//  This is the ONLY file you are expected to edit.
//  Change the values below to customise the game.
// =============================================================

const CONFIG = {

  // ----------------------------------------------------------
  // Title displayed at the top of the screen.
  // Change this to whatever you like.
  // ----------------------------------------------------------
  title: "Educational Game 23",

  // ----------------------------------------------------------
  // Background scene.
  // Valid values: "grass"
  // ----------------------------------------------------------
  background: "meadow",

  // ==========================================================
  //  PLAYER
  // ==========================================================
  player: {

    // Asset name that represents the player character.
    // Valid values: "knight"
    asset: "soldier",

    // Movement speed in pixels per second.
    // Higher = faster player. Suggested: 200
    speed: 200,

    // How many shots the player fires per second when an enemy
    // is within detectionRange.
    // Suggested: 1.5
    shootFrequency: 1.5,
  },

  // ==========================================================
  //  ENEMY
  // ==========================================================
  enemy: {

    // Asset name that represents enemy characters.
    // Valid values: "slime"
    asset: "superzombie",

    // Movement speed of each enemy in pixels per second.
    // Suggested: 90
    speed: 90,

    // Number of enemies spawned in a single spawn event.
    // Suggested: 2
    spawnCount: 5,

    // Time in seconds between each spawn event.
    // Suggested: 3
    spawnInterval: 5,
  },

  // ==========================================================
  //  BULLET
  // ==========================================================
  bullet: {

    // Travel speed of every bullet in pixels per second.
    // Suggested: 350
    speed: 350,

    // Fill colour of the bullet. Any valid CSS colour string.
    // Examples: "#ff4444"  |  "red"  |  "rgb(255,68,68)"
    color: "yellow",

    // Shape used to draw the bullet.
    // Valid values: "circle" | "square" | "triangle" | "star"
    // The matching shape-options block below will be used.
    shape: "triangle",

    // -- Shape options ------------------------------------------
    // Only the block whose name matches `shape` above is used;
    // the others are ignored.

    // Circular bullet — defined by its radius in pixels.
    circle: {
      radius: 6,
    },

    // Square bullet — defined by its width and height in pixels.
    square: {
      side: 20
    },

    // Equilateral triangle bullet — all sides equal, all angles 60°.
    // Defined by a single side length in pixels.
    triangle: {
      side: 40,
    },

    // Star-shaped bullet.
    //   peaks       — number of points on the star (e.g. 5)
    //   outerRadius — distance from centre to a point tip in pixels
    //   innerRadius — distance from centre to an inner notch in pixels
    star: {
      peaks: 5,
      outerRadius: 10,
      innerRadius: 4,
    },
  },
};
