import { useEffect, useState, useRef, useCallback } from "react";
import useUserMedia from "./useUserMedia";
import useDisplayMedia from "./useDisplayMedia";
import useInterval from "use-interval";

const CAMERA_CONSTRAINTS = {
  video: {
    width: { ideal: 1280, max: 1280 },
    height: { ideal: 720, max: 720 },
  },
  audio: false,
};

const DISPLAY_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
  audio: false,
};

export default function useCanvasStream() {
  const { stream: cameraStream, startCamera } =
    useUserMedia(CAMERA_CONSTRAINTS);
  const { stream: displayStream, startDisplay } =
    useDisplayMedia(DISPLAY_CONSTRAINTS);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");

    if (ctx == null) {
      return;
    }

    ctx.fillStyle = "black";
    ctx.fill();

    setStream(canvas.captureStream(30));
  }, []);

  // useEffect(() => {
  //   const ctx = canvasRef?.current?.getContext("2d");
  //   if (stream == null || ctx == null) {
  //     return;
  //   }

  //   const videoTrack = cameraStream?.getVideoTracks()[0];
  //   console.log(videoTrack?.getSettings());

  //   if (videoTrack == null) {
  //     return;
  //   }

  //   const imageCapture = new ImageCapture(videoTrack);

  //   const intervalId = setInterval(() => {
  //     imageCapture.grabFrame().then((imageBitmap) => {
  //       console.log(imageBitmap);
  //       ctx.drawImage(imageBitmap, 0, 0);
  //     });
  //   }, 1000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [stream, cameraStream]);

  useTickCanvas(canvasRef.current);
  return { stream, startCamera, startDisplay, canvasRef };
}

function useTickCanvas(canvas: HTMLCanvasElement | null) {
  useInterval(
    useCallback(() => {
      if (canvas == null) {
        return;
      }
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(canvas, 0, 0);
    }, [canvas]),
    1000 / 30
  );
}
