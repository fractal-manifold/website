// Tiny canvas "engine" shared by the hero visuals: sizing, animation loop, pointer parallax
// and a perspective projection for 3D points. No dependencies, runs client-side only.

export type Vec3 = [number, number, number];
export type RGB = [number, number, number];

export const GOLD: RGB = [245, 158, 11];
export const GOLD_LIGHT: RGB = [251, 191, 36];
export const PURPLE: RGB = [147, 51, 234];
export const PURPLE_LIGHT: RGB = [168, 85, 247];
export const WHITE: RGB = [255, 255, 255];

/** Brand gradient lookup: pure gold up to 0.3, pure purple from 0.7 (same split as --gradient-brand). */
export function brandMix(t: number): RGB {
  const k = Math.min(1, Math.max(0, (t - 0.3) / 0.4));
  return mix(GOLD, PURPLE, k);
}

export function mix(a: RGB, b: RGB, k: number): RGB {
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

export function rgba(c: RGB, a: number): string {
  return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}

/** The warped saddle used across the hero. `u, v ∈ [-1, 1]`; z is the height. `phase` lets it ripple. */
export function saddle(u: number, v: number, phase = 0): Vec3 {
  const z = 0.55 * (u * u - v * v) + 0.14 * Math.sin(3.2 * u + phase) * Math.cos(2.6 * v - phase * 0.7);
  return [u, v, z];
}

export interface View {
  w: number;
  h: number;
  /** Screen centre of the object */
  cx: number;
  cy: number;
  /** Pixels per world unit */
  scale: number;
  /** Rotation around the vertical axis and tilt towards the viewer, in radians */
  yaw: number;
  pitch: number;
  /** Camera distance for perspective (world units) */
  dist: number;
  /** true when the tile is wide enough to keep the object on the right of the text */
  wide: boolean;
}

export interface Projected {
  x: number;
  y: number;
  /** Larger = closer to the viewer */
  depth: number;
  /** Perspective factor (≈1 at the origin, >1 when closer) — use it to scale radii / line widths */
  k: number;
}

export function project(p: Vec3, view: View): Projected {
  const [x, y, z] = p;
  const cy = Math.cos(view.yaw);
  const sy = Math.sin(view.yaw);
  const cp = Math.cos(view.pitch);
  const sp = Math.sin(view.pitch);
  const x1 = x * cy - y * sy;
  const y1 = x * sy + y * cy;
  const y2 = y1 * cp - z * sp;
  const depth = y1 * sp + z * cp;
  const k = view.dist / (view.dist - depth);
  return { x: view.cx + x1 * view.scale * k, y: view.cy + y2 * view.scale * k, depth, k };
}

export interface Frame {
  ctx: CanvasRenderingContext2D;
  /** Seconds since start */
  t: number;
  /** Seconds since previous frame (clamped) */
  dt: number;
  view: View;
  /** Smoothed pointer position over the tile, each axis in [-1, 1] (0 when outside) */
  pointer: { x: number; y: number };
  /** true when prefers-reduced-motion is on: draw a pleasant still frame */
  still: boolean;
}

export interface StartOptions {
  draw: (frame: Frame) => void;
  /** Base orientation; the engine adds a slow sway + pointer parallax on top */
  yaw?: number;
  pitch?: number;
  /** Amplitude of the automatic sway (radians) */
  sway?: number;
  /** Object size relative to the tile */
  size?: number;
  /** Time used for the still frame under reduced motion */
  stillTime?: number;
}

/**
 * Mounts an animated canvas. The canvas should fill its tile (position: absolute; inset: 0).
 * The loop only runs while the canvas is on screen and the tab is visible.
 */
export function startCanvas(canvas: HTMLCanvasElement, opts: StartOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const host = (canvas.closest('.tile') as HTMLElement | null) ?? canvas.parentElement ?? canvas;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const baseYaw = opts.yaw ?? 0.62;
  const basePitch = opts.pitch ?? -0.95;
  const sway = opts.sway ?? 0.35;
  const size = opts.size ?? 1;

  let w = 0;
  let h = 0;
  let running = false;
  let visible = true;
  let raf = 0;
  let start = performance.now();
  let last = start;
  const target = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!running) render(reduce.matches ? (opts.stillTime ?? 6) : (last - start) / 1000, 0);
  }

  function makeView(t: number): View {
    const wide = w > 640;
    const cx = wide ? w * 0.66 : w * 0.52;
    const cy = wide ? h * 0.54 : h * 0.7;
    const scale = (wide ? Math.min(w * 0.27, h * 0.44) : Math.min(w * 0.4, h * 0.27)) * size;
    const still = reduce.matches;
    return {
      w, h, cx, cy, scale, wide,
      yaw: baseYaw + (still ? 0 : Math.sin(t * 0.13) * sway) + pointer.x * 0.35,
      pitch: basePitch + (still ? 0 : Math.sin(t * 0.09) * 0.06) + pointer.y * 0.15,
      dist: 4.5,
    };
  }

  function render(t: number, dt: number) {
    ctx!.clearRect(0, 0, w, h);
    opts.draw({ ctx: ctx!, t, dt, view: makeView(t), pointer, still: reduce.matches });
  }

  function loop(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    pointer.x += (target.x - pointer.x) * Math.min(1, dt * 3);
    pointer.y += (target.y - pointer.y) * Math.min(1, dt * 3);
    render((now - start) / 1000, dt);
    raf = requestAnimationFrame(loop);
  }

  function update() {
    const shouldRun = visible && !document.hidden && !reduce.matches;
    if (shouldRun && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  });
  host.addEventListener('pointerleave', () => {
    target.x = 0;
    target.y = 0;
  });

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
    update();
  }).observe(canvas);
  document.addEventListener('visibilitychange', update);
  reduce.addEventListener('change', () => {
    update();
    resize();
  });

  start = performance.now();
  last = start;
  resize();
  update();
  canvas.classList.add('is-ready');
}
