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
      const side = bullet.shapeParams.side ?? 10;
      ctx.fillRect(-side / 2, -side / 2, side, side);
      break;
    }

    // ----------------------------------------------------------
    //  Triangle — equilateral, tip points forward (+x after rotation).
    //  All sides equal, all angles 60°.
    //  Centroid is used as the draw origin (bullet.x / bullet.y).
    //
    //  For side length s:
    //    h  = s * √3/2          (full height of the triangle)
    //    Centroid → tip  = 2h/3 (forward)
    //    Centroid → base = h/3  (backward)
    //
    //        tip (front)
    //          *
    //         / \
    //        /   \
    //       *-----*
    //  base-left  base-right
    // ----------------------------------------------------------
    case "triangle": {
      const s  = bullet.shapeParams.side ?? 20;
      const h  = s * Math.sqrt(3) / 2; // full triangle height
      const f  = (2 / 3) * h;          // centroid → tip   (forward)
      const b  = (1 / 3) * h;          // centroid → base  (backward)
      const hw = s / 2;                 // half base width

      ctx.beginPath();
      ctx.moveTo( f,   0);   // tip   (front)
      ctx.lineTo(-b,  hw);   // base left
      ctx.lineTo(-b, -hw);   // base right
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
