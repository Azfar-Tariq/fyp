import { useState, useRef, useEffect, useCallback } from "react";
import { MaterialSymbolsBackspaceRounded } from "../../assets/icons/clear";
import { MaterialSymbolsEditOutlineRounded } from "../../assets/icons/edit";
import { UilSave } from "../../assets/icons/save";
// import image2 from "../../assets/images/labs/lab8.jpg";
// import image from "../../assets/images/labfetched/camera_image.jpg";
import imageData from "../../../../../server/images/img.jpg";
import Axios from "axios";

const MINIMUM_SHAPE_SIZE = 10;
const DEFAULT_RECTANGLE_COLOR = "red";
const HIGHLIGHTED_RECTANGLE_COLOR = "blue";

function ImageAnnotator({
  selectedRectangle,
  selectedCamera,
  onSave,
  // imageData,
}) {
  const [data, setData] = useState([]);
  // const [boundedRectanglesData, setBoundedRectanglesData] = useState([]);
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
  // const [imageData, setImageData] = useState(null);
  // const [picture, setPicture] = useState();

  useEffect(() => {
    fetchData();
  });

  // useEffect(() => {
  //   downloadImage();
  // }, []); // Empty dependency array ensures useEffect runs only once

  // const downloadImage = () => {
  //   const apiUrl = "http://10.112.71.52:5000/get_room_image";

  //   fetch(apiUrl)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       // Convert the blob to a data URL
  //       const reader = new FileReader();
  //       reader.readAsDataURL(blob);
  //       reader.onloadend = () => {
  //         const dataUrl = reader.result;
  //         // Set the image data in state
  //         setImageData(dataUrl);
  //       };
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching image:", error);
  //     });
  // };

  // useEffect(() => {
  //   downloadImage();
  // }, []); // Empty dependency array ensures useEffect runs only once

  // const downloadImage = () => {
  //   const apiUrl = "http://10.112.71.52:5000/get_room_image";

  //   fetch(apiUrl)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       // Convert the blob to a data URL
  //       const reader = new FileReader();
  //       reader.readAsDataURL(blob);
  //       reader.onloadend = () => {
  //         const dataUrl = reader.result;
  //         // Set the image data in state
  //         setImageData(dataUrl);
  //       };
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching image:", error);
  //     });
  // };

  // const downloadImage = () => {
  //   const apiUrl = "http://10.120.141.94:5000/get_room_image";

  //   fetch(apiUrl)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       // Create a temporary URL for the blob
  //       const url = window.URL.createObjectURL(blob);

  //       // Create a temporary link element
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = "camera_image.jpg"; // Set the download attribute
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);

  //       // Revoke the temporary URL
  //       window.URL.revokeObjectURL(url);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching image:", error);
  //     });
  // };

  // const fetchImage = async () => {
  //   try {
  //     const response = await Axios.get("http://10.120.141.94/getImage", {
  //       responseType: "blob", // Set response type to blob
  //     });
  //     const imageUrl = URL.createObjectURL(response.data); // Create object URL for blob data
  //     setPicture(imageUrl); // Set image state with URL
  //     console.log("Image fetched successfully");
  //   } catch (error) {
  //     console.error("Failed to fetch image:", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
      );
      setData(response.data);
      // const extractedData = data.map((rectangle) => ({
      //   // id: rectangle.id,
      //   x1: rectangle.x1,
      //   y1: rectangle.y1,
      //   x2: rectangle.x2,
      //   y2: rectangle.y2,
      // }));

      // Store the extracted data in the new state
      // setBoundedRectanglesData(extractedData);
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
    img.src = imageData;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

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

  // useEffect(() => {
  //   console.log("data", data);
  //   // Extract xi, y1, x2, y2, and id from each bounded rectangle in data
  //   const extractedData = data.map((rectangle) => ({
  //     // id: rectangle.id,
  //     x1: rectangle.x1,
  //     y1: rectangle.y1,
  //     x2: rectangle.x2,
  //     y2: rectangle.y2,
  //   }));

  //   // Store the extracted data in the new state
  //   setBoundedRectanglesData(extractedData);
  // }, []);

  const handleSaveButtonClick = async () => {
    try {
      if (selectedRectangleId) {
        handleSaveChanges();
      } else {
        if (annotations.length > 0) {
          // Iterate over annotations to save each rectangle
          for (const annotation of annotations) {
            if (
              annotation.width >= MINIMUM_SHAPE_SIZE &&
              annotation.height >= MINIMUM_SHAPE_SIZE
            ) {
              await Axios.post(
                `http://localhost:3001/readCamera/${selectedCamera}/addBoundedRectangle`,
                {
                  x1: annotation.x,
                  y1: annotation.y,
                  x2: annotation.x + annotation.width,
                  y2: annotation.y + annotation.height,
                  status: 0,
                }
              );
            }
          }
          onSave(); // Notify parent component that changes are saved
          fetchData(); // Fetch data from the database
          setAnnotations([]); // Clear annotations after saving

          try {
            // Fetch all data from the database
            const response = await Axios.get(
              `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
            );
            const fetchedData = response.data;

            // Send fetched data to another PC
            const sendCoordinatesResponse = await Axios.post(
              "http://10.120.143.187:5000/send_coordinates",
              { coordinates: fetchedData }
            );

            console.log(
              "Coordinates sent to other PC:",
              sendCoordinatesResponse.data
            );
          } catch (error) {
            console.error("Failed to send coordinates to other PC:", error);
          }
        } else {
          console.log("No annotations to save");
        }
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
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
    img.src = imageData;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

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
    // imageData,
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
          background: `url(${imageData})`,
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
