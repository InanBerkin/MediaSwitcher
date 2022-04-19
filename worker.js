let canvas, canvasCtx;

function init(event) {
  canvas = event.data.canvas;
  canvasCtx = canvas.getContext("2d", { alpha: false });
}

onmessage = (event) => {
  switch (event.data.msg) {
    case "init":
      init(event);
      break;
    case "draw":
      const stream = event.data.stream;
      const reader = stream.getReader();

      function draw() {
        reader.read().then(function processFrame({ done, value }) {
          if (done) {
            console.log("Stream complete");
            return;
          }

          canvasCtx.drawImage(value, 0, 0);
          value.close();
          return reader.read().then(processFrame);
        });
        requestAnimationFrame(draw);
      }
      requestAnimationFrame(draw);
      break;
    default:
      postMessage(`Error: ${event.data.msg}`);
  }
};
