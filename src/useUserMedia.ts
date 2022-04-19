import { useState } from "react";

export default function useUserMedia(constraints: MediaStreamConstraints) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState();
  const [state, setState] = useState("pending");

  function startCamera() {
    setState("pending");
    return navigator.mediaDevices.getUserMedia(constraints).then(
      (stream) => {
        setState("resolved");
        console.log(stream);
        setStream(stream);
      },
      (error) => {
        console.log({ error });
        setState("rejected");
        setError(error);
      }
    );
  }

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  return { error, state, stream, startCamera, stopCamera };
}
