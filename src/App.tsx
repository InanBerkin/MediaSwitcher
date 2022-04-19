import { useCanvasStreamContext } from "./CanvasStreamContext";
import LivestreamPreview from "./LivestreamPreview";

export default function App() {
  const {
    startCamera,
    startDisplay,
    stream,
    stopCamera,
    stopDisplay
  } = useCanvasStreamContext();

  function blockMain(num: number): number {
    return num <= 1 ? 1 : blockMain(num - 1) + blockMain(num - 2);
  }

  return (
    <div className="App">
      <div>
        <button
          onClick={async () => {
            await startCamera();
            stopDisplay();
          }}
        >
          Camera
        </button>
        <button
          onClick={async () => {
            await startDisplay();
            stopCamera();
          }}
        >
          Display
        </button>
        <button onClick={() => blockMain(40)}>Block Main</button>
      </div>
      <LivestreamPreview stream={stream} />
    </div>
  );
}
