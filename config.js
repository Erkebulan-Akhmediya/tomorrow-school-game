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
  title: "Educational Game",

  // ----------------------------------------------------------
  // Background scene.
  // Valid values: "grass"
  // ----------------------------------------------------------
  background: "cowboy_road",

  // ==========================================================
  //  PLAYER
  // ==========================================================
  player: {

    // Asset name that represents the player character.
    // Valid values: "knight"
    asset: "cowboy",

    // Movement speed in pixels per second.
    // Higher = faster player. Suggested: 200
    speed: 200,

    // How many shots the player fires per second when an enemy
    // is within detectionRange.
    // Suggested: 1.5
    shootFrequency: 1.5,

    // Display size of the player sprite in pixels (width & height).
    // Suggested: 64
    size: 64,
  },

  // ==========================================================
  //  ENEMY
  // ==========================================================
  enemy: {

    // Asset name that represents enemy characters.
    // Valid values: "slime"
    asset: "cowboy",

    // Movement speed of each enemy in pixels per second.
    // Suggested: 90
    speed: 90,

    // Number of enemies spawned in a single spawn event.
    // Suggested: 2
    spawnCount: 5,

    // Time in seconds between each spawn event.
    // Suggested: 3
    spawnInterval: 5,

    // Maximum pixel distance at which the player will auto-shoot
    // at a nearby enemy.
    // Suggested: 400
    detectionRange: 400,

    // Display size of each enemy sprite in pixels (width & height).
    // Suggested: 48
    size: 48,
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
    color: "blue",

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
      sizeLength: 20
    },

    // Triangular bullet — defined by base width and height in pixels.
    triangle: {
      base: 12,
      height: 14,
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
