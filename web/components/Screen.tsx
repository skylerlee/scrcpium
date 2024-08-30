import * as React from 'react';
import { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../store';
import { Connections } from '../connections';
import { Codec } from '../codec';

export const Screen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { serial } = useContext(AppContext);

  useEffect(() => {
    const video = videoRef.current!;
    const conns = new Connections(serial);
    const codec = new Codec();
    conns.open().then(() => {
      conns.listenVideoData((data) => {
        codec.appendRawData(data);
      });
      video.srcObject = codec.getMediaStream();
      video.play();
    });

    return () => {
      conns?.close();
    };
  }, [serial]);

  return <video ref={videoRef} />;
};
