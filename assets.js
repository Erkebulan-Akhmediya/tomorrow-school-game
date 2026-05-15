// =============================================================
//  assets.js — Asset Registry & Loader
//  Maps the string keys used in CONFIG to actual file paths and
//  provides loadAssets() to pre-load every image the game needs.
// =============================================================

// ------------------------------------------------------------------
//  ASSET_REGISTRY
//  Maps category → asset-key → file path.
//  Add new entries here whenever new backgrounds / characters /
//  enemies are added to the project.
// ------------------------------------------------------------------
const ASSET_REGISTRY = {
  backgrounds: {
    cowboy_road: "assets/backgrounds/cowboy_road.png",
  },
  characters: {
    cowboy: [
      "assets/characters/cowboy/1.png",
      "assets/characters/cowboy/2.png"
    ],
  },
  enemies: {
    cowboy: [
      "assets/enemies/cowboy/1.png",
      "assets/enemies/cowboy/2.png"
    ],
  },
};

// ------------------------------------------------------------------
//  LOADED_ASSETS
//  Populated by loadAssets(). After that call resolves, every key
//  holds a fully decoded HTMLImageElement ready for canvas drawing.
//
//  Keys set after loading:
//    "background" — the scene background image
//    "player"     — the player character sprite
//    "enemy"      — the enemy sprite
// ------------------------------------------------------------------
const LOADED_ASSETS = {};

// ------------------------------------------------------------------
//  _resolveAssetPath(category, key)
//  Internal helper — looks up `key` in ASSET_REGISTRY[category].
//  If the key is not found it warns and falls back to the first
//  entry in that category so the game never hard-crashes on a typo.
// ------------------------------------------------------------------
function _resolveAssetPath(category, key) {
  const categoryMap = ASSET_REGISTRY[category];

  if (categoryMap && key in categoryMap) {
    return categoryMap[key];
  }

  // Unknown key — warn the student and fall back gracefully.
  const fallbackKey = Object.keys(categoryMap || {})[0];
  const fallbackPath = categoryMap ? categoryMap[fallbackKey] : null;

  console.warn(
    `[assets.js] Unknown ${category} key: "${key}". ` +
    `Expected one of: [${Object.keys(categoryMap || {}).join(", ")}]. ` +
    `Falling back to "${fallbackKey}" (${fallbackPath}).`
  );

  return fallbackPath;
}

// ------------------------------------------------------------------
//  _loadImage(src)
//  Internal helper — wraps an HTMLImageElement load in a Promise.
//  Rejects with a descriptive error if the file cannot be fetched.
// ------------------------------------------------------------------
function _loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`[assets.js] Failed to load image: "${src}"`));

    img.src = src;
  });
}

// ------------------------------------------------------------------
//  loadAssets()
//  Reads the three asset keys from CONFIG, resolves their file paths
//  via ASSET_REGISTRY, loads all images in parallel, and stores the
//  results in LOADED_ASSETS.
//
//  Returns a Promise that resolves when every image is ready.
//  Call this once at game start before entering the game loop.
//
//  Usage:
//    await loadAssets();
// ------------------------------------------------------------------
async function loadAssets() {
  // Resolve file paths from CONFIG values (with fallback on bad keys).
  const backgroundPath = _resolveAssetPath("backgrounds", CONFIG.background);
  const playerPath = _resolveAssetPath("characters", CONFIG.player.asset);
  const enemyPath = _resolveAssetPath("enemies", CONFIG.enemy.asset);

  // If playerPath is an array, load all frames. Otherwise, load the single image and wrap it in an array.
  const playerPaths = Array.isArray(playerPath) ? playerPath : [playerPath];
  const enemyPaths = Array.isArray(enemyPath) ? enemyPath : [enemyPath];

  // Load all images concurrently.
  const [backgroundImg, playerImgs, enemyImgs] = await Promise.all([
    _loadImage(backgroundPath),
    Promise.all(playerPaths.map(p => _loadImage(p))),
    Promise.all(enemyPaths.map(p => _loadImage(p))),
  ]);

  // Store decoded images for the renderer to use.
  LOADED_ASSETS["background"] = backgroundImg;
  LOADED_ASSETS["player"] = playerImgs;
  LOADED_ASSETS["enemy"] = enemyImgs;
}
