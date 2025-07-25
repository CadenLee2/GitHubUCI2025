export function timeUntil(timePoint: number) {
  const timeLeft = timePoint - Date.now();
  const secLeftTotal = Math.floor(timeLeft / 1000);
  const minLeft = Math.floor(secLeftTotal / 60);
  const secLeft = secLeftTotal % 60;
  return { minLeft, secLeft };
}

export function renderDiamond(
  ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string
) {
  ctx.beginPath();
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x + width, y + height / 2);
  ctx.lineTo(x + width / 2, y + height);
  ctx.lineTo(x, y + height / 2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function renderRoundRect(
  ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 8);
  ctx.fill();
}
