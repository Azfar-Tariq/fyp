import { useState, useRef, useEffect, useCallback } from "react";
import { MaterialSymbolsBackspaceRounded } from "../../assets/icons/clear";
import { MaterialSymbolsEditOutlineRounded } from "../../assets/icons/edit";
import { UilSave } from "../../assets/icons/save";
import image from "../../assets/images/labs/lab8.jpg";
import Axios from "axios";

const MINIMUM_SHAPE_SIZE = 10;
const DEFAULT_RECTANGLE_COLOR = "red";
const HIGHLIGHTED_RECTANGLE_COLOR = "blue";

function ImageAnnotator({ selectedRectangle, selectedCamera }) {
  const [data, setData] = useState([]);
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
  const [selectedRectangleId, setSelectedRectangleId] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
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
      }
    },
    [drawing, selectedAnnotation, startPoint.x, startPoint.y, currentAnnotation]
  );

  const handleMouseUp = useCallback(() => {
    if (drawing) {
      setDrawing(false);

      if (
        currentAnnotation.width >= MINIMUM_SHAPE_SIZE &&
        currentAnnotation.height >= MINIMUM_SHAPE_SIZE
      ) {
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
  }, [drawing, selectedAnnotation, currentAnnotation, annotations]);

  const handleClearChanges = () => {
    setAnnotations([]);
  };

  useEffect(() => {
    setSelectedRectangleId(selectedRectangle);
  }, [selectedRectangle]);

  const callEditedRectangle = () => {
    if (selectedRectangleId) {
      Axios.get(
        `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
      )
        .then((response) => {
          const selectedRectData = response.data.find(
            (rectangle) => rectangle.RectangleID === selectedRectangleId
          );
          if (selectedRectData) {
            setAnnotations((prevAnnotations) => [
              ...prevAnnotations,
              {
                id: selectedRectData.RectangleID,
                x: selectedRectData.x1,
                y: selectedRectData.y1,
                width: selectedRectData.x2 - selectedRectData.x1,
                height: selectedRectData.y2 - selectedRectData.y1,
              },
            ]);
            drawEditedRectangle();
          }
        })
        .catch((error) => {
          console.error("Failed to get data:", error);
        });
    }
  };

  const drawEditedRectangle = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;

      const drawLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const color =
          annotations.id === selectedRectangleId
            ? HIGHLIGHTED_RECTANGLE_COLOR
            : DEFAULT_RECTANGLE_COLOR;
        drawRectangle(ctx, annotations, color);
        annotations
          .filter((annotation) => annotation.id === selectedRectangleId)
          .forEach((annotation) => {
            drawRectangle(ctx, annotation, "green");
          });
        if (drawing) {
          drawRectangle(ctx, currentAnnotation);
        }
      };
      requestAnimationFrame(drawLoop);
    };
  };

  const handleSaveChanges = async () => {
    try {
      if (selectedRectangleId) {
        const selectedRectanlge = annotations.find(
          (annotation) => annotation.id === selectedRectangleId
        );
        if (selectedRectangle) {
          const { id, x, y, width, height } = selectedRectanlge;

          await Axios.put(
            `http://localhost:3001/updateBoundedRectangle/${id}`,
            {
              x1: x,
              y1: y,
              x2: x + width,
              y2: y + height,
              status: 0,
            }
          );
          console.log("Updated rectangle");
          setAnnotations([]);
        }
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
  };

  const handleSaveButtonClick = async () => {
    console.log(annotations);
    try {
      if (selectedRectangleId) {
        handleSaveChanges();
      } else {
        console.log("Saveeee");
        console.log(annotations);
        if (annotations.length > 0) {
          // Iterate over annotations to save each rectangle
          for (const annotation of annotations) {
            if (
              annotation.width >= MINIMUM_SHAPE_SIZE &&
              annotation.height >= MINIMUM_SHAPE_SIZE
            ) {
              console.log(annotation);
              const { x, y, width, height } = annotation;
              console.log(x, y, width, height);
              await Axios.post(
                `http://localhost:3001/readCamera/${selectedCamera}/addBoundedRectangle`,
                {
                  x1: x,
                  y1: y,
                  x2: x + width,
                  y2: y + height,
                  status: 0,
                }
              );
            }
          }
          console.log("Coordinates added successfully");
          fetchData();
          setAnnotations([]); // Clear annotations after saving
        } else {
          console.log("No annotations to save");
        }
      }
    } catch (error) {
      console.error("Failed to save rectangle", error);
    }
  };

  useEffect(() => {
    setButtonDisabled(selectedRectangle === null);
  }, [selectedRectangle]);

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

        data.forEach((coordinates) => {
          const annotation = {
            id: coordinates.RectangleID,
            x: coordinates.x1,
            y: coordinates.y1,
            width: coordinates.x2 - coordinates.x1,
            height: coordinates.y2 - coordinates.y1,
          };
          const color =
            annotation.id === selectedRectangleId
              ? HIGHLIGHTED_RECTANGLE_COLOR
              : DEFAULT_RECTANGLE_COLOR;
          drawRectangle(ctx, annotation, color);
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
    data,
    selectedRectangle,
    selectedRectangleId,
  ]);

  return (
    <div
      style={{ position: "relative", width: "fit-content" }}
      ref={wrapperRef}
    >
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
      <div className="hidden sm:flex gap-4 m-2">
        <button
          className="bg-background text-white flex p-2 gap-2 rounded hover:bg-icon hover:text-black duration-150"
          onClick={handleClearChanges}
        >
          <MaterialSymbolsBackspaceRounded />
          Clear Changes
        </button>
        <button
          className={`flex p-2 gap-2 rounded bg-background text-white duration-150 ${
            buttonDisabled
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-icon hover:text-black"
          }`}
          disabled={buttonDisabled}
          onClick={callEditedRectangle}
        >
          <MaterialSymbolsEditOutlineRounded />
          Edit Changes
        </button>
        <button
          className="flex p-2 gap-2 rounded bg-background text-white hover:bg-icon hover:text-black duration-150"
          onClick={handleSaveButtonClick}
        >
          <UilSave />
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ImageAnnotator;
