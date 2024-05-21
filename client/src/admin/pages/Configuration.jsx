/* eslint-disable no-unused-vars */
import Table from "../components/Configuration_Components/Table";
import Select from "../components/Configuration_Components/Select";
import { useEffect, useState } from "react";
import Axios from "axios";
import ImageAnnotator from "../components/Configuration_Components/ImageAnnotator";

const placeholderImage = "https://via.placeholder.com/800x400";
const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS;
const RASPBERRY_IP = import.meta.env.VITE_RASPBERRY_PI_IP;
const RASPBERRY_PORT = import.meta.env.VITE_RASPBERRY_PI_PORT;

export default function Configuration() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [selectedRectangle, setSelectedRectangle] = useState(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    downloadImage();
  }, []); // Empty dependency array ensures useEffect runs only once

  const downloadImage = () => {
    // const apiUrl = `${RASPBERRY_IP}:${RASPBERRY_PORT}/get_room_image`;
    // const apiUrl = "10.120.171.170/get_room_image";
    // replace with raspberry pi or other pc ip address
    // const apiUrl = "10.120.171.170/get_room_image";
    const apiUrl = `${HOST_ADDRESS}/get_room_image`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        // Convert the blob to a data URL
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const dataUrl = reader.result;
          // Set the image data in state
          setImageData(dataUrl);
        };
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };

  // useEffect(() => {
  //   downloadImage();
  // }, []);

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

  const handleAreaChange = (areaId) => {
    setSelectedArea(areaId);
  };
  const handleCameraChange = (cameraId) => {
    setSelectedCamera(cameraId);
  };

  const handleSelectedRectangleChange = (rectangleId) => {
    setSelectedRectangle(rectangleId);
  };

  const handleImageAnnotatorSave = () => {
    setTableKey((prevKey) => prevKey + 1);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios.get(
        `${HOST_ADDRESS}/readCamera/${selectedCamera}/readBoundedRectangles`
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCamera) {
      setLoading(true);
      Axios.get(
        `${HOST_ADDRESS}/readCamera/${selectedCamera}/readBoundedRectangles`
      )
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to get data:", error);
          setLoading(false);
        });
    }
  }, [selectedCamera]);

  return (
    <div className="bg-primary py-6 px-4 flex flex-col h-full overflow-y-auto">
      <div className="flex-1">
        <div className="flex gap-8">
          <div>
            {selectedCamera ? (
              <div>
                <ImageAnnotator
                  selectedRectangle={selectedRectangle}
                  selectedCamera={selectedCamera}
                  onSave={handleImageAnnotatorSave}
                  imageData={imageData}
                />
              </div>
            ) : (
              <div>
                <img src={placeholderImage} className="rounded-md" />
              </div>
            )}
          </div>
          <div>
            <Select
              selectedArea={selectedArea}
              selectedCamera={selectedCamera}
              onAreaChange={handleAreaChange}
              onCameraChange={handleCameraChange}
            />
          </div>
        </div>
      </div>
      {selectedCamera && (
        <div className="mt-4">
          <Table
            key={tableKey}
            selectedCamera={selectedCamera}
            onSelectedRectangleChange={handleSelectedRectangleChange}
            onDeleteRectangle={fetchData}
          />
        </div>
      )}
    </div>
  );
}
