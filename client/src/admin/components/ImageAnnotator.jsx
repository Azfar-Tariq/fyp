import { useState, useRef, useEffect, useCallback } from "react";
import image from "../assets/images/labs/lab8.jpg";

const MINIMUM_SHAPE_SIZE = 10;

function ImageAnnotator({ onBoxCreated, pcData }) {
  const [annotations, setAnnotations] = useState([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentAnnotation, setCurrentAnnotation] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  const drawRectangle = useCallback((ctx, annotation) => {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height);
    ctx.stroke();
  }, []);

  const isPointInsideRectangle = useCallback((point, rectangle) => {
    return (
      point.x >= rectangle.x &&
      point.x <= rectangle.x + rectangle.width &&
      point.y >= rectangle.y &&
      point.y <= rectangle.y + rectangle.height
    );
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
      const wrapper = wrapperRef.current;
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clickedAnnotation = annotations.find((annotation) =>
        isPointInsideRectangle({ x, y }, annotation)
      );

      if (clickedAnnotation) {
        // Select the clicked annotation for editing
        setSelectedAnnotation(clickedAnnotation);
        setStartPoint({ x, y });
      } else {
        // Start drawing a new annotation
        setStartPoint({ x, y });
        setDrawing(true);
        setCurrentAnnotation({
          x,
          y,
          width: 0,
          height: 0,
        });
      }
    },
    [annotations, isPointInsideRectangle]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (drawing) {
        const wrapper = wrapperRef.current;
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const width = x - startPoint.x;
        const height = y - startPoint.y;

        if (width >= MINIMUM_SHAPE_SIZE && height >= MINIMUM_SHAPE_SIZE) {
          setCurrentAnnotation({
            ...currentAnnotation,
            width,
            height,
          });

          setAnnotations((prevAnnotations) =>
            prevAnnotations.map((annotation) =>
              annotation === selectedAnnotation
                ? { ...annotation, ...currentAnnotation }
                : annotation
            )
          );
        }
      } else if (selectedAnnotation) {
        // Move the selected annotation
        const wrapper = wrapperRef.current;
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const deltaX = x - selectedAnnotation.x - selectedAnnotation.width / 2;
        const deltaY = y - selectedAnnotation.y - selectedAnnotation.height / 2;

        const updatedAnnotation = {
          ...selectedAnnotation,
          x: selectedAnnotation.x + deltaX,
          y: selectedAnnotation.y + deltaY,
        };

        setAnnotations((prevAnnotations) =>
          prevAnnotations.map((annotation) =>
            annotation === selectedAnnotation ? updatedAnnotation : annotation
          )
        );
        setSelectedAnnotation(updatedAnnotation);

        onBoxCreated({
          topLeft: { x: updatedAnnotation.x, y: updatedAnnotation.y },
          bottomRight: {
            x: updatedAnnotation.x + updatedAnnotation.width,
            y: updatedAnnotation.y + updatedAnnotation.height,
          },
        });
      }
    },
    [
      drawing,
      selectedAnnotation,
      startPoint.x,
      startPoint.y,
      currentAnnotation,
      onBoxCreated,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (drawing) {
      setDrawing(false);

      if (
        currentAnnotation.width >= MINIMUM_SHAPE_SIZE &&
        currentAnnotation.height >= MINIMUM_SHAPE_SIZE
      ) {
        const topLeft = { x: currentAnnotation.x, y: currentAnnotation.y };
        const bottomRight = {
          x: currentAnnotation.x + currentAnnotation.width,
          y: currentAnnotation.y + currentAnnotation.height,
        };

        onBoxCreated({ topLeft, bottomRight });
        setAnnotations([...annotations, currentAnnotation]);
      }

      setCurrentAnnotation({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    } else if (selectedAnnotation) {
      setAnnotations([...annotations, selectedAnnotation]);
      setSelectedAnnotation(null);
    }
  }, [
    drawing,
    selectedAnnotation,
    currentAnnotation,
    onBoxCreated,
    annotations,
  ]);

  const handleClearChanges = () => {
    setAnnotations([]);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;

      const drawLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pcData.forEach((coordinates) => {
          const annotation = {
            x: coordinates.x1,
            y: coordinates.y1,
            width: coordinates.x2 - coordinates.x1,
            height: coordinates.y2 - coordinates.y1,
          };
          drawRectangle(ctx, annotation);
        });
        annotations.forEach((annotation) => {
          drawRectangle(ctx, annotation);
        });
        if (drawing) {
          drawRectangle(ctx, currentAnnotation);
        }
      };
      requestAnimationFrame(drawLoop);
    };

    return () => {
      wrapper.removeEventListener("mousedown", handleMouseDown);
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    annotations,
    drawing,
    currentAnnotation,
    drawRectangle,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    pcData,
  ]);

  return (
    <div style={{ position: "relative" }} ref={wrapperRef}>
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid #ccc",
          display: "block",
          background: `url(${image})`,
          backgroundSize: "100% 100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="hidden sm:block m-2">
        <button
          className="bg-red-500 text-white p-2 rounded"
          onClick={handleClearChanges}
        >
          Clear Changes
        </button>
      </div>
    </div>
  );
}

export default ImageAnnotator;
