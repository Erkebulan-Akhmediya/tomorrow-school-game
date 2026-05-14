// =============================================================
//  collision.js — Collision Detection
//  Exposes globals:      checkCollisions(player, enemies, bullets, onPlayerDeath)
//  Private (non-global): aabb(a, b)  — kept inside an IIFE so it
//    never appears on window and cannot clash with other scripts.
// =============================================================

const checkCollisions = (() => {

  // ------------------------------------------------------------------
  //  aabb(a, b)  — PRIVATE
  //  Axis-Aligned Bounding Box overlap test.
  //  Both objects must have:  x, y  (centre point)  width, height
  //  Returns true if the two rectangles overlap.
  // ------------------------------------------------------------------
  function aabb(a, b) {
    const aHalfW = a.width / 2;
    const aHalfH = a.height / 2;
    const bHalfW = b.width / 2;
    const bHalfH = b.height / 2;

    return (
      Math.abs(a.x - b.x) < aHalfW + bHalfW &&
      Math.abs(a.y - b.y) < aHalfH + bHalfH
    );
  }

  // ------------------------------------------------------------------
  //  checkCollisions(player, enemies, bullets, onPlayerDeath)  — PUBLIC
  //
  //  Step 1 — Bullet vs Enemy
  //    Each live bullet is tested against every live enemy.
  //    On overlap both are marked dead (isAlive = false).
  //
  //  Step 2 — Enemy vs Player
  //    Each live enemy is tested against the player.
  //    On overlap the player is marked dead and onPlayerDeath() is
  //    called, then the loop exits immediately.
  //
  //  Step 3 — Array filtering is intentionally NOT done here.
  //    Dead entities are filtered in game.js so students can see
  //    that logic in one clear place.
  // ------------------------------------------------------------------
  return function checkCollisions(player, enemies, bullets, onPlayerDeath) {

    // ── Step 1: Bullet vs Enemy ──────────────────────────────────────
    for (const bullet of bullets) {
      if (!bullet.isAlive) continue;

      for (const enemy of enemies) {
        if (!enemy.isAlive) continue;

        if (aabb(bullet, enemy)) {
          console.log("bullet hit enemy");
          bullet.isAlive = false;
          enemy.isAlive = false;
        }
      }
    }

    // ── Step 2: Enemy vs Player ──────────────────────────────────────
    if (!player.isAlive) return; // player already dead — nothing to test

    for (const enemy of enemies) {
      if (!enemy.isAlive) continue;

      if (aabb(enemy, player)) {
        console.log("enemy hit player");
        player.isAlive = false;
        onPlayerDeath();
        break; // one hit is enough; stop checking immediately
      }
    }
  };

})(); // end IIFE — aabb stays private, checkCollisions is now a global const
