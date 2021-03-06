import { useState } from "react";

export default function useDisplayMedia(constraints: MediaStreamConstraints) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState();
  const [state, setState] = useState("pending");

  function stopDisplay() {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }

  function startDisplay() {
    let canceled = false;

    setState("pending");
    return navigator.mediaDevices.getDisplayMedia(constraints).then(
      (stream) => {
        if (!canceled) {
          setState("resolved");
          setStream(stream);
          stream.getVideoTracks()[0].onended = () => {
            stopDisplay();
          };
        }
      },
      (error) => {
        if (!canceled) {
          setState("rejected");
          setError(error);
        }
      }
    );
  }

  return { error, state, stream, startDisplay, stopDisplay };
}
