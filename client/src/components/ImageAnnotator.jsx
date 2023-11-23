import { useState, useRef, useEffect, useCallback } from "react";
import image from "../assets/images/labs/lab1.jpg";

const MINIMUM_SHAPE_SIZE = 10;

function ImageAnnotator() {
	const [annotations, setAnnotations] = useState([]);
	const [drawing, setDrawing] = useState(false);
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
	const [currentAnnotation, setCurrentAnnotation] = useState({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		name: "",
		editing: false,
	});
	const [annotationNames, setAnnotationNames] = useState({});
	const wrapperRef = useRef(null);
	const canvasRef = useRef(null);

	const drawRectangle = useCallback(
		(ctx, annotation) => {
			ctx.strokeStyle = "red";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.rect(annotation.x, annotation.y, annotation.width, annotation.height);
			ctx.stroke();

			// Display the name alongside the center of the annotation box
			ctx.fillStyle = "black";
			const centerX = annotation.x + annotation.width / 2;
			const centerY = annotation.y + annotation.height / 2;
			ctx.fillText(annotationNames[annotation.id] || "", centerX, centerY);
		},
		[annotationNames]
	);

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

			// Check if the click is on an existing annotation for editing
			const clickedAnnotation = annotations.find((annotation) =>
				isPointInsideRectangle({ x, y }, annotation)
			);

			if (clickedAnnotation) {
				setCurrentAnnotation({ ...clickedAnnotation, editing: true });
			} else {
				setStartPoint({ x, y });
				setDrawing(true);
				setCurrentAnnotation({
					x,
					y,
					width: 0,
					height: 0,
					name: "",
					editing: false,
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

				// Check if the rectangle is larger than the minimum size
				if (width >= MINIMUM_SHAPE_SIZE && height >= MINIMUM_SHAPE_SIZE) {
					setCurrentAnnotation({
						...currentAnnotation,
						width,
						height,
					});
				}
			}
		},
		[drawing, startPoint, currentAnnotation]
	);

	const handleMouseUp = useCallback(() => {
		if (drawing) {
			setDrawing(false);

			// Check if the rectangle is larger than the minimum size before adding
			if (
				currentAnnotation.width >= MINIMUM_SHAPE_SIZE &&
				currentAnnotation.height >= MINIMUM_SHAPE_SIZE
			) {
				if (currentAnnotation.editing) {
					// Update existing annotation
					const updatedAnnotations = annotations.map((annotation) =>
						annotation.id === currentAnnotation.id
							? currentAnnotation
							: annotation
					);
					setAnnotations(updatedAnnotations);
				} else {
					// Add new annotation
					const newAnnotation = { ...currentAnnotation, id: Date.now() };
					setAnnotations([...annotations, newAnnotation]);
					setAnnotationNames((prevNames) => ({
						...prevNames,
						[newAnnotation.id]: "",
					}));
				}
			}

			setCurrentAnnotation({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				name: "",
				editing: false,
			});
		}
	}, [drawing, currentAnnotation, annotations]);

	const handleNameChange = useCallback(
		(e) => {
			const { id } = currentAnnotation;
			setAnnotationNames((prevNames) => ({
				...prevNames,
				[id]: e.target.value,
			}));
		},
		[currentAnnotation]
	);

	const handleAnnotationClick = useCallback(
		(id) => {
			const clickedAnnotation = annotations.find(
				(annotation) => annotation.id === id
			);
			if (clickedAnnotation) {
				const { x, y, width, height } = clickedAnnotation;
				const topLeft = { x, y };
				const topRight = { x: x + width, y };
				const bottomLeft = { x, y: y + height };
				const bottomRight = { x: x + width, y: y + height };

				console.log("Coordinates:");
				console.log(`Top Left: x=${topLeft.x}, y=${topLeft.y}`);
				console.log(`Top Right: x=${topRight.x}, y=${topRight.y}`);
				console.log(`Bottom Left: x=${bottomLeft.x}, y=${bottomLeft.y}`);
				console.log(`Bottom Right: x=${bottomRight.x}, y=${bottomRight.y}`);
			}
		},
		[annotations]
	);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		// Set canvas dimensions to match the size of the parent wrapper
		canvas.width = wrapper.clientWidth;
		canvas.height = wrapper.clientHeight;

		// Clear the canvas and redraw annotations whenever annotations change
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		annotations.forEach((annotation) => drawRectangle(ctx, annotation));
		if (drawing) {
			drawRectangle(ctx, currentAnnotation);
		}

		// Cleanup: remove event listeners when the component unmounts
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
	]);

	return (
		<div style={{ position: "relative" }} ref={wrapperRef}>
			<canvas
				ref={canvasRef}
				style={{
					border: "1px solid #ccc",
					display: "block",
					background: `url(${image})`,
					backgroundSize: "cover",
				}}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onClick={() => handleAnnotationClick(currentAnnotation.id)}
			/>
			{currentAnnotation.editing && (
				<div
					style={{
						position: "absolute",
						left: currentAnnotation.x + currentAnnotation.width + 5,
						top: currentAnnotation.y,
					}}
				>
					<label>Name:</label>
					<input
						type='text'
						value={annotationNames[currentAnnotation.id] || ""}
						onChange={handleNameChange}
					/>
				</div>
			)}
		</div>
	);
}

export default ImageAnnotator;
