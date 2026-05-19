// =============================================================
//  entities.js — Game Entity Classes
//  Depends on globals: CONFIG, INTERNAL_CONFIG, LOADED_ASSETS, inputState
//  Exposes globals:    Player, Enemy, Bullet
// =============================================================

// =============================================================
//  class Player
// =============================================================
class Player {
  constructor(canvasWidth, canvasHeight) {
    this.width = INTERNAL_CONFIG.player.size * 0.5;
    this.height = INTERNAL_CONFIG.player.size;

    // Start at the centre of the canvas.
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;

    this.speed = CONFIG.player.speed;
    this.images = LOADED_ASSETS["player"]; // Array of frames

    // Animation state
    this.animationTimer = 0;
    this.currentFrame = 0;

    // Counts up each frame; a shot fires when it reaches the shoot interval.
    this.shootTimer = 0;

    this.isAlive = true;
  }

  // ----------------------------------------------------------------
  //  update(dt, inputState, canvasWidth, canvasHeight)
  //  Move the player based on held keys and clamp within the canvas.
  // ----------------------------------------------------------------
  update(dt, inputState, canvasWidth, canvasHeight) {
    // Apply movement.
    if (inputState.up) this.y -= this.speed * dt;
    if (inputState.down) this.y += this.speed * dt;
    if (inputState.left) this.x -= this.speed * dt;
    if (inputState.right) this.x += this.speed * dt;

    // Clamp so the sprite stays fully inside the canvas.
    const halfW = this.width / 2;
    const halfH = this.height / 2;
    this.x = Math.max(halfW, Math.min(canvasWidth - halfW, this.x));
    this.y = Math.max(halfH, Math.min(canvasHeight - halfH, this.y));

    // Handle walking animation
    this.animationTimer += dt;
    if (this.animationTimer >= INTERNAL_CONFIG.player.animationFrameDuration) {
      this.animationTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % this.images.length;
    }

    // Advance the shoot cooldown timer.
    this.shootTimer += dt;
  }

  // ----------------------------------------------------------------
  //  tryShoot(enemies, bullets)
  //  If the cooldown has elapsed and an enemy is in range, fire a
  //  bullet toward the nearest one.
  // ----------------------------------------------------------------
  tryShoot(enemies, bullets) {
    const interval = 1 / CONFIG.player.shootFrequency;
    if (this.shootTimer < interval) return;

    // Player centre (x, y are already the centre).
    const cx = this.x;
    const cy = this.y;

    // Find the closest living enemy within detectionRange.
    let closestEnemy = null;
    let closestDist = Infinity;

    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;

      const ex = enemy.x;
      const ey = enemy.y;
      const dist = Math.hypot(ex - cx, ey - cy);

      if (dist <= INTERNAL_CONFIG.enemy.detectionRange && dist < closestDist) {
        closestDist = dist;
        closestEnemy = enemy;
      }
    }

    if (!closestEnemy) return; // no target in range

    // Reset cooldown and fire.
    this.shootTimer = 0;
    const angle = Math.atan2(closestEnemy.y - cy, closestEnemy.x - cx);
    bullets.push(new Bullet(cx, cy, angle));
  }

  // ----------------------------------------------------------------
  //  draw(ctx)
  // ----------------------------------------------------------------
  draw(ctx) {
    const hw = this.width / 2;
    const hh = this.height / 2;
    // Draw the current animation frame
    ctx.drawImage(this.images[this.currentFrame], this.x - hw, this.y - hh, this.width, this.height);
  }
}

// =============================================================
//  class Enemy
// =============================================================
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.width = INTERNAL_CONFIG.enemy.size * 0.5;
    this.height = INTERNAL_CONFIG.enemy.size;

    this.speed = CONFIG.enemy.speed;
    this.images = LOADED_ASSETS["enemy"]; // Array of frames

    // Animation state
    this.animationTimer = 0;
    this.currentFrame = 0;

    this.isAlive = true;
  }

  // ----------------------------------------------------------------
  //  update(dt, playerX, playerY)
  //  Move toward the player's centre at a constant speed.
  // ----------------------------------------------------------------
  update(dt, playerX, playerY) {
    const angle = Math.atan2(playerY - this.y, playerX - this.x);
    this.x += Math.cos(angle) * this.speed * dt;
    this.y += Math.sin(angle) * this.speed * dt;

    // Handle walking animation
    this.animationTimer += dt;
    if (this.animationTimer >= INTERNAL_CONFIG.enemy.animationFrameDuration) {
      this.animationTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % this.images.length;
    }
  }

  // ----------------------------------------------------------------
  //  draw(ctx)
  // ----------------------------------------------------------------
  draw(ctx) {
    const hw = this.width / 2;
    const hh = this.height / 2;
    ctx.drawImage(this.images[this.currentFrame], this.x - hw, this.y - hh, this.width, this.height);
  }
}

// =============================================================
//  class Bullet
// =============================================================
class Bullet {
  // Small margin (px) beyond which a bullet is considered off-screen.
  static OUT_OF_BOUNDS_MARGIN = 20;

  constructor(x, y, angle) {
    this.x = x;
    this.y = y;

    // Velocity components derived from angle and configured speed.
    this.vx = Math.cos(angle) * CONFIG.bullet.speed;
    this.vy = Math.sin(angle) * CONFIG.bullet.speed;

    this.color = CONFIG.bullet.color;
    this.shape = CONFIG.bullet.shape;

    // Pull the matching shape-params sub-object from CONFIG.
    this.shapeParams = CONFIG.bullet[this.shape] ?? {};

    // Compute axis-aligned bounding box dimensions from the shape so
    // that aabb() in collision.js has real width/height values to work
    // with. Each formula matches the geometry drawn in renderer.js.
    const p = this.shapeParams;
    switch (this.shape) {
      case "circle":
        this.width = (p.radius ?? 6) * 2;
        this.height = (p.radius ?? 6) * 2;
        break;
      case "square":
        this.width = p.width ?? 10;
        this.height = p.height ?? 10;
        break;
      case "triangle": {
        // Equilateral triangle: AABB width = h = s*√3/2, AABB height = s.
        const s = p.side ?? 20;
        this.width = s * Math.sqrt(3) / 2;
        this.height = s;
        break;
      }
      case "star":
        this.width = (p.outerRadius ?? 10) * 2;
        this.height = (p.outerRadius ?? 10) * 2;
        break;
      default:
        // Fallback matches the default circle drawn in renderer.js.
        this.width = 12;
        this.height = 12;
    }

    this.isAlive = true;
  }

  // ----------------------------------------------------------------
  //  update(dt, canvasWidth, canvasHeight)
  //  Advance position and mark as dead when off-screen.
  // ----------------------------------------------------------------
  update(dt, canvasWidth, canvasHeight) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const m = Bullet.OUT_OF_BOUNDS_MARGIN;
    if (
      this.x < -m || this.x > canvasWidth + m ||
      this.y < -m || this.y > canvasHeight + m
    ) {
      this.isAlive = false;
    }
  }

  // ----------------------------------------------------------------
  //  draw(ctx)
  //  Delegates to drawBullet() defined in renderer.js.
  // ----------------------------------------------------------------
  draw(ctx) {
    drawBullet(ctx, this);
  }
}
