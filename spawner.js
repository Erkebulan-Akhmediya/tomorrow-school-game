// =============================================================
//  spawner.js — Enemy Spawning
//  Depends on globals: CONFIG, Enemy
//  Exposes globals:    Spawner
// =============================================================

// =============================================================
//  class Spawner
// =============================================================
class Spawner {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth  = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Counts up each frame; a wave fires when it reaches spawnInterval.
    this.spawnTimer = 0;
  }

  // ----------------------------------------------------------------
  //  update(dt, enemies)
  //  Advance the timer and trigger a wave when the interval elapses.
  // ----------------------------------------------------------------
  update(dt, enemies) {
    this.spawnTimer += dt;

    if (this.spawnTimer >= CONFIG.enemy.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnWave(enemies);
    }
  }

  // ----------------------------------------------------------------
  //  spawnWave(enemies)
  //  Spawns CONFIG.enemy.spawnCount enemies in one wave.
  // ----------------------------------------------------------------
  spawnWave(enemies) {
    for (let i = 0; i < CONFIG.enemy.spawnCount; i++) {
      this.spawnOne(enemies);
    }
  }

  // ----------------------------------------------------------------
  //  spawnOne(enemies)
  //  Picks a random canvas edge and places one enemy just outside it,
  //  at a random position along that edge, then pushes it into the
  //  enemies array.
  //
  //  Edges:  0 = top  |  1 = bottom  |  2 = left  |  3 = right
  // ----------------------------------------------------------------
  spawnOne(enemies) {
    const size   = CONFIG.enemy.size;   // enemy sprite size in px
    const offset = size;                // how far off-screen to start

    const edge = Math.floor(Math.random() * 4);
    let x, y;

    switch (edge) {
      case 0: // top — enemy enters from above
        x = Math.random() * this.canvasWidth;
        y = -offset;
        break;

      case 1: // bottom — enemy enters from below
        x = Math.random() * this.canvasWidth;
        y = this.canvasHeight + offset;
        break;

      case 2: // left — enemy enters from the left
        x = -offset;
        y = Math.random() * this.canvasHeight;
        break;

      case 3: // right — enemy enters from the right
        x = this.canvasWidth + offset;
        y = Math.random() * this.canvasHeight;
        break;
    }

    enemies.push(new Enemy(x, y));
  }
}
