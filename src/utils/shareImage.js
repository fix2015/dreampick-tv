import { img } from './assets';
import { isNativePlatform } from './platform';

const W = 1080;
const H = 1350;
const SHARE_URL = 'https://dreampick-tv.probooking.app';

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    // Separate cache entry so a non-CORS cached copy can't taint the canvas
    image.src = `${src}${src.includes('?') ? '&' : '?'}share=1`;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCover(ctx, image, x, y, size) {
  const scale = Math.max(size / image.width, size / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, x + (size - w) / 2, y + (size - h) / 2, w, h);
}

/**
 * Draw the player's dream summary onto a canvas and return a PNG Blob.
 * @param {{ items: Array<{image:string, rarity:string}>, stars:number, title:string, subtitle:string, rarityColor:(r:string)=>string }} data
 */
export async function createSummaryImage({ items, stars, title, subtitle, rarityColor }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#7B68EE');
  bg.addColorStop(1, '#E879A8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  try { await document.fonts?.load('700 72px Fredoka'); } catch { /* font optional */ }
  const font = (size, weight = 700) => `${weight} ${size}px Fredoka, system-ui, sans-serif`;

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = font(76);
  ctx.fillText(title, W / 2, 140);
  ctx.font = font(40, 500);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(subtitle, W / 2, 205);

  const shown = items.slice(0, 9);
  const images = await Promise.all(shown.map(i => loadImage(img(i.image))));
  const cols = 3;
  const gap = 28;
  const size = (W - 120 - gap * (cols - 1)) / cols;
  const rows = Math.ceil(shown.length / cols) || 1;
  const gridTop = 260 + (3 - rows) * (size + gap) / 2;

  shown.forEach((item, i) => {
    const x = 60 + (i % cols) * (size + gap);
    const y = gridTop + Math.floor(i / cols) * (size + gap);
    ctx.save();
    roundRect(ctx, x, y, size, size, 32);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();
    ctx.clip();
    if (images[i]) drawCover(ctx, images[i], x, y, size);
    ctx.restore();
    roundRect(ctx, x, y, size, size, 32);
    ctx.lineWidth = 10;
    ctx.strokeStyle = rarityColor(item.rarity);
    ctx.stroke();
  });

  ctx.fillStyle = '#FFFFFF';
  ctx.font = font(56);
  ctx.fillText(`⭐ ${stars}`, W / 2, H - 140);
  ctx.font = font(34, 500);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('DreamPick TV · dreampick-tv.probooking.app', W / 2, H - 70);

  return new Promise((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Share a PNG: @capacitor/share on native, Web Share API (with files) on the web,
 * falling back to a download when file sharing isn't supported.
 * Returns 'shared' | 'downloaded' | 'cancelled'.
 */
export async function shareImage(blob, { title, text }) {
  const fileName = `dreampick-${Date.now()}.png`;

  if (isNativePlatform()) {
    const [{ Filesystem, Directory }, { Share }] = await Promise.all([
      import('@capacitor/filesystem'),
      import('@capacitor/share'),
    ]);
    const { uri } = await Filesystem.writeFile({
      path: fileName,
      data: await blobToBase64(blob),
      directory: Directory.Cache,
    });
    try {
      await Share.share({ title, text, files: [uri], dialogTitle: title });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }

  const file = new File([blob], fileName, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title, text: `${text} ${SHARE_URL}` });
      return 'shared';
    } catch {
      return 'cancelled';
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return 'downloaded';
}
