import * as React from 'react';
import { useEffect, useRef, useContext } from 'react';
import { AppContext } from '../store';
import { Connections } from '../connections';
import { Codec } from '../codec';

export const Screen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { serial } = useContext(AppContext);

  useEffect(() => {
    if (!serial) {
      return;
    }

    const video = videoRef.current!;
    const conns = new Connections(serial);
    const codec = new Codec();
    conns.open().then(() => {
      conns.listenVideoData((data) => {
        codec.appendRawData(new Uint8Array(data));
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
