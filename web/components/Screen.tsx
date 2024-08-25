import * as React from 'react';
import { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../store';
import { Connection } from '../models/Connection';
import { Codec } from '../models/Codec';

export const Screen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { serial } = useContext(AppContext);

  useEffect(() => {
    let conn = null;
    if (videoRef.current && serial) {
      conn = new Connection(serial);
      conn.open();
      const codec = new Codec();
      videoRef.current.srcObject = codec.getMediaStream();
    }

    return () => {
      conn?.close();
    };
  }, [serial]);

  return <video ref={videoRef} />;
};
