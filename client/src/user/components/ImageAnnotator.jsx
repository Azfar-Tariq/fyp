import { useState, useRef, useEffect, useCallback } from "react";
// import image2 from "../../assets/images/labs/lab8.jpg";
// import image from "../../assets/images/labfetched/camera_image.jpg";
import image from "../../../../server/images/lab_image.jpg";
import Axios from "axios";

const DEFAULT_RECTANGLE_COLOR = "red";
const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS;

function ImageAnnotator({ selectedCamera }) {
  const [data, setData] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        `${HOST_ADDRESS}/readCamera/${selectedCamera}/readBoundedRectangles`
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const drawRectangle = useCallback((ctx, annotation, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height);
    ctx.stroke();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      data.forEach((coordinates) => {
        const annotation = {
          x: coordinates.x1,
          y: coordinates.y1,
          width: coordinates.x2 - coordinates.x1,
          height: coordinates.y2 - coordinates.y1,
        };
        const color = DEFAULT_RECTANGLE_COLOR;
        drawRectangle(ctx, annotation, color);
      });
    };
  }, [data, drawRectangle]);

  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid #ccc",
          display: "block",
          background: `url(${image})`,
          backgroundSize: "100% 100%",
        }}
      />
    </div>
  );
}

export default ImageAnnotator;
