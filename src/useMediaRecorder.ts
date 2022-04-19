import { useRef } from "react";

export default function useMediaRecorder() {
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  function startRecording(
    mediaStream: MediaStream,
    handleDataAvailable: (e: Event) => void
  ) {
    mediaRecorder.current = new MediaRecorder(mediaStream, {
      mimeType: "video/webm; codecs=vp9",
    });

    mediaRecorder.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );

    mediaRecorder.current.start(1000 / 30);
  }

  function stopRecording() {
    //
  }

  return { startRecording, stopRecording, mediaRecorder };
}
