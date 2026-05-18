// =============================================================
//  game.js — Main Game Loop & Entry Point
//  Depends on globals: CONFIG, LOADED_ASSETS, loadAssets,
//    inputState, Player, Enemy, Bullet, Spawner,
//    checkCollisions, drawBullet
// =============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ── DOM References ────────────────────────────────────────────────
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const overlayH2 = overlay.querySelector("h2");
  const btnContinue = document.getElementById("btnContinue");
  const btnReload = document.getElementById("btnReload");
  const btnShare = document.getElementById("btnShare");
  const gameTitle = document.getElementById("gameTitle");
  
  const shareDialog = document.getElementById("shareDialog");
  const shareForm = document.getElementById("shareForm");
  const telegramUsernameInput = document.getElementById("telegramUsername");
  const btnCancelShare = document.getElementById("btnCancelShare");

  let shareScreenshotData = "";

  // ── Canvas Size ───────────────────────────────────────────────────
  canvas.width = INTERNAL_CONFIG.canvasWidth;
  canvas.height = window.innerHeight;

  // ── Title ─────────────────────────────────────────────────────────
  gameTitle.textContent = CONFIG.title;

  // ── Startup log ───────────────────────────────────────────────────
  console.log(
    "Game loaded. Edit config.js to customize the game!\n" +
    JSON.stringify(CONFIG, null, 2)
  );

  // ── Resize handler ────────────────────────────────────────────────
  // Keeps the canvas filling the window and clamps the player to the
  // new bounds so it is never trapped outside the visible area.
  window.addEventListener("resize", () => {
    canvas.width = INTERNAL_CONFIG.canvasWidth;
    canvas.height = window.innerHeight;

    if (player) {
      const halfW = player.width / 2;
      const halfH = player.height / 2;
      player.x = Math.max(halfW, Math.min(canvas.width - halfW, player.x));
      player.y = Math.max(halfH, Math.min(canvas.height - halfH, player.y));
    }
  });

  // ── Button listeners (registered once, not inside init) ──────────
  // Registered here so they are attached exactly once regardless of
  // how many times init() might be called in the future.
  btnContinue.addEventListener("click", resume);
  btnReload.addEventListener("click", () => location.reload());

  btnShare.addEventListener("click", () => {
    overlay.style.display = "none";
    shareScreenshotData = canvas.toDataURL("image/png");
    shareDialog.showModal();
  });

  btnCancelShare.addEventListener("click", () => {
    shareDialog.close();
    if (paused) {
      overlay.style.display = "flex";
    }
  });

  shareForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = telegramUsernameInput.value;
    
    fetch(INTERNAL_CONFIG.shareEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, image: shareScreenshotData })
    })
    .then(res => {
      if (res.ok) {
        shareDialog.close();
        alert("successfully shared the screenshot");
        if (paused) overlay.style.display = "flex";
      } else {
        alert("Failed to share.");
      }
    })
    .catch(err => {
      console.error("Error sharing:", err);
      alert("Error sharing screenshot.");
    });
  });

  // ── Load assets then start ────────────────────────────────────────
  loadAssets().then(() => {
    init();
  });

  // =================================================================
  //  Game State  (declared here so all inner functions close over
  //  the same variables)
  // =================================================================
  let player, enemies, bullets, spawner;
  let paused = false;
  let lastTime = null;

  // =================================================================
  //  init()
  //  Resets / initialises all game state and kicks off the loop.
  // =================================================================
  function init() {
    player = new Player(canvas.width, canvas.height);
    enemies = [];
    bullets = [];
    spawner = new Spawner(canvas.width, canvas.height);

    paused = false;
    lastTime = null;

    // Pause when the tab loses visibility.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) pause();
    });

    window.addEventListener('blur', () => {
      pause();
    })

    requestAnimationFrame(loop);
  }

  // =================================================================
  //  loop(timestamp)
  //  The main RAF loop — always re-registers itself so pause/resume
  //  never need to restart it.
  //
  //  NOTE: requestAnimationFrame(loop) is called BEFORE the paused
  //  check, so the loop is never cancelled. After onPlayerDeath() sets
  //  paused = true, the final death frame is already on screen and the
  //  loop just idles — no RAF restart needed to resume later.
  // =================================================================
  function loop(timestamp) {
    // Compute delta time in seconds.
    if (lastTime === null) lastTime = timestamp;
    let dt = (timestamp - lastTime) / 1000;

    // Clamp to avoid a huge jump after the tab was hidden or paused.
    dt = Math.min(dt, 0.1);

    lastTime = timestamp;

    // Keep the loop alive unconditionally — even while paused or after death.
    requestAnimationFrame(loop);

    // Skip simulation and drawing while paused.
    if (paused) return;

    update(dt);
    render();
  }

  // =================================================================
  //  update(dt)
  //  Runs all game logic in the documented order.
  // =================================================================
  function update(dt) {
    // 1. Move the player.
    player.update(dt, inputState, canvas.width, canvas.height);

    // 2. Fire bullets at nearby enemies.
    player.tryShoot(enemies, bullets);

    // 3. Spawn new enemies on a timer.
    spawner.update(dt, enemies);

    // 4. Move each enemy toward the player.
    for (const enemy of enemies) {
      enemy.update(dt, player.x, player.y);
    }

    // 5. Move each bullet forward and cull off-screen ones.
    for (const bullet of bullets) {
      bullet.update(dt, canvas.width, canvas.height);
    }

    // 6. Detect and handle all collisions.
    checkCollisions(player, enemies, bullets, onPlayerDeath);

    // 7 & 8. Remove dead entities so arrays don't grow unboundedly.
    //   (Filtering is done here, not inside collision.js, so students
    //    can see the full data flow in one place.)
    enemies = enemies.filter(e => e.isAlive);
    bullets = bullets.filter(b => b.isAlive);
  }

  // =================================================================
  //  render()
  //  Draws the full scene each frame.
  // =================================================================
  function render() {
    // 1. Clear the previous frame.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw the background stretched to fill the canvas.
    ctx.drawImage(LOADED_ASSETS["background"], 0, 0, canvas.width, canvas.height);

    // 3. Draw enemies beneath the player.
    for (const enemy of enemies) {
      enemy.draw(ctx);
    }

    // 4. Draw the player.
    player.draw(ctx);

    // 5. Draw bullets on top of everything.
    for (const bullet of bullets) {
      bullet.draw(ctx);
    }
  }

  // =================================================================
  //  Pause System
  // =================================================================

  function pause() {
    paused = true;
    overlay.style.display = "flex";
  }

  function resume() {
    paused = false;
    lastTime = null; // reset so dt doesn't spike on the next frame
    overlay.style.display = "none";
  }

  // =================================================================
  //  onPlayerDeath()
  //  Called by checkCollisions when an enemy reaches the player.
  //  Sets paused = true so the loop idles — the death frame stays
  //  visible because render() was already called this tick before
  //  checkCollisions ran, and RAF keeps the canvas alive.
  // =================================================================
  function onPlayerDeath() {
    paused = true;
    overlayH2.textContent = "Game Over";
    btnContinue.style.display = "none";
    overlay.style.display = "flex";
  }

});
