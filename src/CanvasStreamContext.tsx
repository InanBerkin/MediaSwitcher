import * as React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import useDisplayMedia from "./useDisplayMedia";
import useUserMedia from "./useUserMedia";
const worker = new Worker("/worker.js");

worker.onmessage = (evt) => {
  console.log({ evt });
};

type ProviderProps = { children: React.ReactNode };
const CanvasStreamContext = React.createContext<
  | {
      startCamera: () => Promise<void>;
      startDisplay: () => Promise<void>;
      stream: MediaStream | null;
      stopCamera: () => void;
      stopDisplay: () => void;
    }
  | undefined
>(undefined);

const CAMERA_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
};

const DISPLAY_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 }
  },
  audio: false
};

function CanvasStreamContextProvider({ children }: ProviderProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { stream: cameraStream, startCamera, stopCamera } = useUserMedia(
    CAMERA_CONSTRAINTS
  );
  const { stream: displayStream, startDisplay, stopDisplay } = useDisplayMedia(
    DISPLAY_CONSTRAINTS
  );

  const transferStreamToWorker = useCallback(
    (stream: MediaStream) => {
      const videoTrack = stream.getVideoTracks()[0];
      const { readable: readableStream } = new MediaStreamTrackProcessor({
        track: videoTrack
      });

      const composedTrackGenerator = new MediaStreamTrackGenerator({
        kind: "video"
      });
      const sink = composedTrackGenerator.writable;

      worker.postMessage(
        {
          readableStream,
          sink,
          msg: "draw"
        },
        [readableStream, sink]
      );

      const compositedMediaStream = new MediaStream([composedTrackGenerator]);
      setStream(compositedMediaStream);
    },
    [setStream]
  );

  useEffect(() => {
    if (cameraStream == null || cameraStream.active === false) {
      return;
    }

    transferStreamToWorker(cameraStream);
  }, [cameraStream, transferStreamToWorker]);

  useEffect(() => {
    if (displayStream == null || displayStream.active === false) {
      return;
    }

    transferStreamToWorker(displayStream);
  }, [displayStream, transferStreamToWorker]);

  const value = useMemo(() => {
    return {
      stream,
      startCamera,
      startDisplay,
      stopCamera,
      stopDisplay
    };
  }, [stream, startCamera, startDisplay, stopCamera, stopDisplay]);

  return (
    <CanvasStreamContext.Provider value={value}>
      {children}
    </CanvasStreamContext.Provider>
  );
}

function useCanvasStreamContext() {
  const context = React.useContext(CanvasStreamContext);
  if (context === undefined) {
    throw new Error(
      "useCanvasStreamContext must be used within a CanvasStreamContextProvider"
    );
  }
  return context;
}

export { CanvasStreamContextProvider, useCanvasStreamContext };
