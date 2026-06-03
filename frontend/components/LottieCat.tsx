'use client';

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface Props {
  className?: string;
  width?: number;
  cropTop?: number;
  cropBottom?: number;
}

export default function LottieCat({ className = '', width = 240, cropTop = 0, cropBottom = 0 }: Props) {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/lottie/cat-play-ball.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return null;

  const visibleHeight = width - cropTop - cropBottom;

  return (
    <div
      className={className}
      style={{ width, height: visibleHeight, overflow: 'hidden' }}
    >
      <Lottie animationData={data} loop autoplay style={{ width, marginTop: -cropTop }} />
    </div>
  );
}
