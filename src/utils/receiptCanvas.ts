import type { CheckResult } from '../types';

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line ? `${line} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function drawCherryKissMark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  angleDeg = -8
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.scale(scale, scale);

  // Upper lip
  ctx.fillStyle = '#D91E36';
  ctx.beginPath();
  ctx.moveTo(-64, -4);
  ctx.bezierCurveTo(-48, -32, -22, -36, -8, -20);
  ctx.bezierCurveTo(-3, -15, 3, -15, 8, -20);
  ctx.bezierCurveTo(22, -36, 48, -32, 64, -4);
  ctx.bezierCurveTo(40, 2, 16, -2, 0, -5);
  ctx.bezierCurveTo(-16, -2, -40, 2, -64, -4);
  ctx.closePath();
  ctx.fill();

  // Lower lip
  ctx.beginPath();
  ctx.moveTo(-58, 6);
  ctx.bezierCurveTo(-28, 3, 28, 3, 58, 6);
  ctx.bezierCurveTo(45, 38, 18, 44, 0, 42);
  ctx.bezierCurveTo(-18, 44, -45, 38, -58, 6);
  ctx.closePath();
  ctx.fill();

  // Glossy highlight & lip crease lines
  ctx.strokeStyle = 'rgba(250, 243, 232, 0.38)';
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-36, -13);
  ctx.quadraticCurveTo(-22, -20, -14, -14);
  ctx.moveTo(15, 22);
  ctx.quadraticCurveTo(28, 20, 38, 14);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(130, 10, 24, 0.45)';
  ctx.lineWidth = 1.6;
  for (const offsetX of [-34, -18, 0, 18, 34]) {
    ctx.beginPath();
    ctx.moveTo(offsetX, 11);
    ctx.lineTo(offsetX * 0.92, 28);
    ctx.stroke();
  }

  ctx.restore();
}

export async function generateReceiptBlob(result: CheckResult): Promise<Blob | null> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const width = 1080;
  const height = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Espresso Velvet background
  ctx.fillStyle = '#120B0A';
  ctx.fillRect(0, 0, width, height);

  // Subtle top editorial tag
  ctx.fillStyle = '#E89B25';
  ctx.font = '700 28px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText("BESTIE, CHECK THIS RECEIPT", width / 2, 118);

  // Cocktail-napkin cream card
  const cardX = 84;
  const cardY = 166;
  const cardW = width - 168;
  const cardH = 1560;

  ctx.fillStyle = '#FAF3E8';
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Serrated top & bottom cutouts
  ctx.fillStyle = '#120B0A';
  for (let x = cardX + 18; x < cardX + cardW; x += 36) {
    ctx.beginPath();
    ctx.arc(x, cardY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, cardY + cardH, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cherry kiss stamp top-right of receipt
  drawCherryKissMark(ctx, cardX + cardW - 145, cardY + 135, 1.25, -8);

  // Brand header inside receipt
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1A1110';
  ctx.font = 'italic 700 68px "Playfair Display", Georgia, serif';
  ctx.fillText('Honnnneyyyy', cardX + 64, cardY + 128);

  ctx.fillStyle = '#6E5A56';
  ctx.font = '500 24px "JetBrains Mono", monospace';
  const now = new Date();
  const caseId = `HNY-${String(now.getHours()).padStart(2, '0')}${String(
    now.getMinutes()
  ).padStart(2, '0')}-${result.sweetener_score}`;
  ctx.fillText(`RECEIPT #${caseId}  //  ${now.toLocaleDateString()}`, cardX + 64, cardY + 182);

  // Dashed divider
  ctx.strokeStyle = '#C9B9AA';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(cardX + 64, cardY + 230);
  ctx.lineTo(cardX + cardW - 64, cardY + 230);
  ctx.stroke();
  ctx.setLineDash([]);

  // Sweetener Score block
  ctx.fillStyle = '#D91E36';
  ctx.font = '700 26px "JetBrains Mono", monospace';
  ctx.fillText('ARTIFICIAL SWEETENER SCORE', cardX + 64, cardY + 305);

  ctx.fillStyle = '#1A1110';
  ctx.font = '800 132px "JetBrains Mono", monospace';
  ctx.fillText(`${result.sweetener_score}%`, cardX + 60, cardY + 445);

  ctx.fillStyle = '#D91E36';
  ctx.font = '700 30px "JetBrains Mono", monospace';
  ctx.fillText('FAKE SUGAR DETECTED', cardX + 380, cardY + 425);

  // Verdict headline
  ctx.fillStyle = '#1A1110';
  ctx.font = 'italic 700 50px "Playfair Display", Georgia, serif';
  let nextY = wrapText(
    ctx,
    result.verdict_headline,
    cardX + 64,
    cardY + 530,
    cardW - 128,
    64
  );

  // Blush Pink Co-Star Roast Box
  const roastBoxY = nextY + 28;
  ctx.fillStyle = '#F7C5CC';
  ctx.fillRect(cardX + 64, roastBoxY, cardW - 128, 250);
  ctx.strokeStyle = '#1A1110';
  ctx.lineWidth = 4;
  ctx.strokeRect(cardX + 64, roastBoxY, cardW - 128, 250);

  ctx.fillStyle = '#1A1110';
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillText('CO-STAR BESTIE TAKEAWAY', cardX + 96, roastBoxY + 54);

  ctx.font = 'italic 700 38px "Playfair Display", Georgia, serif';
  wrapText(ctx, `“${result.costar_roast}”`, cardX + 96, roastBoxY + 116, cardW - 192, 50);

  // Flagged tactics list
  let listY = roastBoxY + 335;
  ctx.fillStyle = '#6E5A56';
  ctx.font = '700 24px "JetBrains Mono", monospace';
  ctx.fillText('WHAT WE SPOTTED ON THE NAPKIN', cardX + 64, listY);
  listY += 46;

  for (const item of result.flagged_phrases.slice(0, 3)) {
    ctx.fillStyle = '#D91E36';
    ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`• ${item.tactic.toUpperCase()}`, cardX + 64, listY);
    listY += 38;

    ctx.fillStyle = '#1A1110';
    ctx.font = '500 27px "Plus Jakarta Sans", sans-serif';
    listY = wrapText(ctx, item.margin_note, cardX + 86, listY, cardW - 150, 36);
    listY += 22;
  }

  // Footer stamp inside receipt
  ctx.strokeStyle = '#C9B9AA';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 10]);
  ctx.beginPath();
  ctx.moveTo(cardX + 64, cardY + cardH - 155);
  ctx.lineTo(cardX + cardW - 64, cardY + cardH - 155);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#1A1110';
  ctx.font = '700 28px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('honnneyyyy.embarko.app', width / 2, cardY + cardH - 86);

  ctx.fillStyle = '#FAF3E8';
  ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    'Short, sweet, and totally fake? Checked with Honnnneyyyy.',
    width / 2,
    1818
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export async function downloadReceiptPng(result: CheckResult): Promise<void> {
  const blob = await generateReceiptBlob(result);
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `honnnneyyyy-receipt-${result.sweetener_score}.png`;
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
