import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDisplayMedia from "./useDisplayMedia";
import useUserMedia from "./useUserMedia";
const worker = new Worker("/worker.js");

type ProviderProps = { children: React.ReactNode };
const CanvasStreamContext = React.createContext<
  | {
      startCamera: () => void;
      startDisplay: () => void;
      stream: MediaStream | null;
      stopCamera: () => void;
      stopDisplay: () => void;
    }
  | undefined
>(undefined);

const CAMERA_CONSTRAINTS = {
  video: true,
  audio: true,
};

const DISPLAY_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
  audio: false,
};

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

function CanvasStreamContextProvider({ children }: ProviderProps) {
  const {
    stream: cameraStream,
    startCamera,
    stopCamera,
  } = useUserMedia(CAMERA_CONSTRAINTS);
  const {
    stream: displayStream,
    startDisplay,
    stopDisplay,
  } = useDisplayMedia(DISPLAY_CONSTRAINTS);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera
  useEffect(() => {
    if (
      cameraStream == null ||
      cameraStream.active === false ||
      canvasRef.current == null
    ) {
      return;
    }
    const videoTrack = cameraStream.getVideoTracks()[0];
    const videoEl = document.createElement("video");
    videoEl.muted = true;
    videoEl.srcObject = cameraStream;
    videoEl.play();

    const offscreen = canvasRef.current.transferControlToOffscreen();
    worker.postMessage({ canvas: offscreen, msg: "init" }, [offscreen]);

    worker.onmessage = (evt) => {
      console.log(evt);
    };

    const mediaProcessor = new MediaStreamTrackProcessor({ track: videoTrack });
    const readableStream: ReadableStream = mediaProcessor.readable;

    worker.postMessage(
      {
        stream: readableStream,
        msg: "draw",
      },
      [readableStream]
    );

    setStream(canvasRef.current.captureStream(30));
  }, [cameraStream]);

  useEffect(() => {
    if (displayStream == null || displayStream.active === false) {
      return;
    }

    setStream(displayStream);
  }, [displayStream]);

  const value = useMemo(() => {
    return {
      stream,
      startCamera,
      startDisplay,
      stopCamera,
      stopDisplay,
    };
  }, [stream, startCamera, startDisplay]);

  return (
    <CanvasStreamContext.Provider value={value}>
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ display: "none" }}
      ></canvas>
      <video
        width={1280}
        height={720}
        style={{ display: "none" }}
        muted
        autoPlay
      />
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