// =============================================================
//  renderer.js — Drawing Utilities
//  Exposes globals: drawBullet(ctx, bullet)
// =============================================================

// Used to suppress repeated console.warn for unrecognised shapes.
let _unknownShapeWarned = false;

// =============================================================
//  drawBullet(ctx, bullet)
//
//  Draws a single bullet centred on (bullet.x, bullet.y).
//  The canvas is saved/restored around every draw call so no
//  state leaks into the rest of the render pipeline.
// =============================================================
function drawBullet(ctx, bullet) {
  ctx.save();

  // Move origin to bullet centre and rotate to face direction of travel.
  ctx.translate(bullet.x, bullet.y);
  ctx.rotate(Math.atan2(bullet.vy, bullet.vx));

  ctx.fillStyle = bullet.color;

  switch (bullet.shape) {

    // ----------------------------------------------------------
    //  Circle — shape-independent of rotation, but we still
    //  rotate so exotic future shapes are consistent.
    // ----------------------------------------------------------
    case "circle": {
      const r = bullet.shapeParams.radius ?? 6;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    // ----------------------------------------------------------
    //  Square — centred on origin after rotation.
    // ----------------------------------------------------------
    case "square": {
      const sl = bullet.shapeParams.sizeLength ?? 10;
      ctx.fillRect(-sl / 2, -sl / 2, sl, sl);
      break;
    }

    // ----------------------------------------------------------
    //  Triangle — tip points forward (+x after rotation),
    //  base sits at the rear (-x).
    //
    //        tip (front)
    //         *
    //        / \
    //       /   \
    //      *-----*
    //    base-left  base-right
    // ----------------------------------------------------------
    case "triangle": {
      const base = bullet.shapeParams.base ?? 12;
      const height = bullet.shapeParams.height ?? 14;
      const halfB = base / 2;

      ctx.beginPath();
      ctx.moveTo(height / 2, 0);      // tip   (front)
      ctx.lineTo(-height / 2, halfB);    // base left
      ctx.lineTo(-height / 2, -halfB);    // base right
      ctx.closePath();
      ctx.fill();
      break;
    }

    // ----------------------------------------------------------
    //  Star — peaks outer/inner points evenly distributed
    //  around 2π, starting aligned with the direction of travel.
    // ----------------------------------------------------------
    case "star": {
      const peaks = bullet.shapeParams.peaks ?? 5;
      const outerRadius = bullet.shapeParams.outerRadius ?? 10;
      const innerRadius = bullet.shapeParams.innerRadius ?? 4;
      const totalPoints = peaks * 2; // alternating outer / inner
      const step = Math.PI / peaks; // angle between each point

      ctx.beginPath();
      for (let i = 0; i < totalPoints; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * step - Math.PI / 2; // start pointing "up" (forward after rotation)
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }

    // ----------------------------------------------------------
    //  Fallback — unrecognised shape; draw a small circle and
    //  warn once so the developer can spot the misconfiguration.
    // ----------------------------------------------------------
    default: {
      if (!_unknownShapeWarned) {
        console.warn(
          `[renderer.js] Unrecognised bullet.shape: "${bullet.shape}". ` +
          `Valid values: "circle" | "square" | "triangle" | "star". ` +
          `Falling back to a small circle. This warning is shown once.`
        );
        _unknownShapeWarned = true;
      }

      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}
