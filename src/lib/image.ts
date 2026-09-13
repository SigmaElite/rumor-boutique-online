import imageCompression from 'browser-image-compression';

/**
 * Сжатие изображения на клиенте перед загрузкой в хранилище.
 * WebP, ширина до 1200px, вес до ~200 КБ, качество 80%.
 */
export const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith('image/')) return file;
  // SVG и GIF (анимация) не сжимаем
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      initialQuality: 0.9,
      fileType: 'image/webp',
      useWebWorker: true,
    });

    const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([compressed], name, { type: 'image/webp' });
  } catch (e) {
    console.error('Image compression failed, uploading original:', e);
    return file;
  }
};

/**
 * Возвращает URL изображения нужной ширины через трансформации хранилища.
 * Внешние/локальные картинки возвращаются без изменений.
 */
export const getImageUrl = (
  url: string | undefined | null,
  width: number,
  quality = 75,
): string => {
  if (!url) return '/placeholder.svg';
  if (!url.includes('/storage/v1/object/public/')) return url;

  const [base, query] = url.split('?');
  const rendered = base.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  const params = new URLSearchParams(query);
  params.set('width', String(width));
  params.set('quality', String(quality));
  params.set('resize', 'contain');
  return `${rendered}?${params.toString()}`;
};

/** Миниатюра для каталога / сеток товаров (~40 КБ). */
export const thumbUrl = (url?: string | null) => getImageUrl(url, 300, 70);

/** Фото для карточки товара (~150–200 КБ). */
export const fullUrl = (url?: string | null) => getImageUrl(url, 1200, 80);
