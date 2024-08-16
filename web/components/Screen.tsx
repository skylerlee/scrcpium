import * as React from 'react';
import { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../store';
import { Connection } from '../models/Connection';

export const Screen = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { serial } = useContext(AppContext);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    let conn = null;
    if (serial) {
      conn = new Connection(serial);
      conn.open();
    }

    return () => {
      conn?.close();
    };
  }, [serial]);

  return <canvas ref={canvasRef} />;
};
