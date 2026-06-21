import { useState } from 'react';
import type { IconName } from '@/types';
import { ProductIcon } from './icons';
import styles from './ProductThumb.module.css';

/**
 * Product imagery: a real photo when `image` is provided and loads, otherwise
 * a line icon in a neutral rounded tile (also the fallback if the photo 404s).
 */
export function ProductThumb({
  icon,
  image,
  alt = '',
  size = 'md',
}: {
  icon: IconName;
  image?: string;
  alt?: string;
  size?: 'lg' | 'md' | 'sm';
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;

  return (
    <div
      className={`${styles.thumb} ${styles[size]} ${showImage ? styles.hasImage : ''}`}
    >
      {showImage ? (
        <img
          src={image}
          alt={alt}
          className={styles.image}
          onError={() => setFailed(true)}
        />
      ) : (
        <ProductIcon name={icon} className={styles.icon} />
      )}
    </div>
  );
}
