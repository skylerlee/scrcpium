import * as React from 'react';
import { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../store';
import { Connection } from '../models/Connection';
import { Codec } from '../models/Codec';

export const Screen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { serial } = useContext(AppContext);

  useEffect(() => {
    const video = videoRef.current!;
    const conn = new Connection(serial);
    conn.open().then(() => {
      const codec = new Codec();
      conn.listenVideoData((data) => {
        codec.appendRawData(data);
      });
      video.srcObject = codec.getMediaStream();
      video.play();
    });

    return () => {
      conn?.close();
    };
  }, [serial]);

  return <video ref={videoRef} />;
};
