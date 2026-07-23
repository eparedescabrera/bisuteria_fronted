/**
 * Comprime imágenes en el navegador para evitar ERR_HTTP2_PROTOCOL_ERROR
 * en proxies (Railway) con multipart grandes.
 */
export async function compressImageFile(file, options = {}) {
  const maxWidth = options.maxWidth || 1200;
  const maxHeight = options.maxHeight || 1200;
  const quality = options.quality || 0.72;
  const maxBytes = options.maxBytes || 600 * 1024;

  if (!file?.type?.startsWith('image/')) return file;
  // No recomprimir si ya es liviana
  if (file.size <= maxBytes && file.size <= 400 * 1024) return file;

  const bitmap = await createImageBitmap(file);
  try {
    let { width, height } = bitmap;
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        (b) => resolve(b),
        'image/jpeg',
        quality
      );
    });

    if (!blob) return file;

    const name = file.name.replace(/\.\w+$/, '.jpg');
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
  } finally {
    bitmap.close?.();
  }
}

export async function compressImageFiles(files = []) {
  const out = [];
  for (const file of files) {
    out.push(await compressImageFile(file));
  }
  return out;
}
