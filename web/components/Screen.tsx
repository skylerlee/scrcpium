import * as React from 'react';
import { useEffect, useRef } from 'react';

export const Screen = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 100, 100);
    }
  }, []);

  return <canvas ref={canvasRef} />;
};
