import * as React from 'react';
import { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../store';

export const Screen = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { serial } = useContext(AppContext);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 100, 100);
    }
  }, [serial]);

  return <canvas ref={canvasRef} />;
};
