const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

const canvas = new OffscreenCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
const ctx = canvas.getContext("2d");

onmessage = (event) => {
  switch (event.data.msg) {
    case "draw":
      const readableStream = event.data.readableStream;
      const sink = event.data.sink;

      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const transformer = new TransformStream({
        async transform(cameraFrame, controller) {
          if (cameraFrame && cameraFrame?.displayWidth > 0) {
            const leftPos = (CANVAS_WIDTH - cameraFrame.codedWidth) / 2;
            const topPos = (CANVAS_HEIGHT - cameraFrame.codedHeight) / 2;

            ctx.drawImage(cameraFrame, leftPos, topPos);

            const newFrame = new VideoFrame(canvas, {
              timestamp: cameraFrame.timestamp
            });
            cameraFrame.close();
            controller.enqueue(newFrame);
          }
        }
      });

      readableStream.pipeThrough(transformer).pipeTo(sink);
      break;
    default:
      postMessage(`Error: ${event.data.msg}`);
  }
};
