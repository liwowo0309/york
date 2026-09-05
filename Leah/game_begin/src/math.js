export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}
