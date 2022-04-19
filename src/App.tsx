import { useCanvasStreamContext } from "./CanvasStreamContext";
import LivestreamPreview from "./LivestreamPreview";

export default function App() {
  const { startCamera, startDisplay, stream, stopCamera, stopDisplay } =
    useCanvasStreamContext();

  return (
    <div className="App">
      <div>
        <button
          onClick={() => {
            stopDisplay();
            startCamera();
          }}
        >
          Camera
        </button>
        <button
          onClick={() => {
            stopCamera();
            startDisplay();
          }}
        >
          Display
        </button>
      </div>
      <LivestreamPreview stream={stream} />
    </div>
  );
}
