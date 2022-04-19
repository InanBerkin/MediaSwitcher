import { useCallback } from "react";
import useInterval from "use-interval";

export default function useTickCanvas(canvas: HTMLCanvasElement | null) {
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
