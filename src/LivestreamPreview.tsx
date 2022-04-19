import { useRef, useEffect } from "react";

type Props = {
  stream: MediaStream | null;
};

export default function LivestreamPreview({ stream }: Props) {
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoPreviewRef.current && stream) {
      // const streamSettings = stream.getVideoTracks()[0].getSettings();
      // console.log({ streamSettings });
      videoPreviewRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return (
    <video
      ref={videoPreviewRef}
      width={1280}
      height={720}
      autoPlay={true}
      muted={true}
      controls
      style={{ objectFit: "cover" }}
    />
  );
}
