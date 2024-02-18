/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Add from "../components/Add";
import Card from "../components/Card";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import Axios from "axios";
import Labs from "../components/Labs";
import { ToastContainer, toast } from "react-toastify";
import ModalOverlay from "../components/ModalOverlay";
import { PulseLoader } from "react-spinners";

const fetchData = async (setAreaList) => {
  try {
    const response = await Axios.get("http://localhost:3001/readArea");
    setAreaList(response.data);
  } catch (err) {
    console.error("Failed to get Areas:", err);
  }
};

export default function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [areaDescription, setAreaDescription] = useState(""); // Added areaDescription state
  const [areaList, setAreaList] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedAreaName, setSelectedAreaName] = useState("");
  const [loading, setLoading] = useState(false);

  const updatedAreaData = () => {
    fetchData(setAreaList);
  };

  useEffect(() => {
    setLoading(true);
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setAreaList(response.data);
        setLoading(false);
      }, [])
      .catch((err) => {
        console.error("Failed to get areas:", err);
        setLoading(false);
      });
  }, []);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleSubmitDialog = () => {
    Axios.post("http://localhost:3001/insertArea", {
      areaName: areaName,
      description: areaDescription, // Passed areaDescription to the request
    })
      .then((response) => {
        console.log(response.data);
        updatedAreaData();
        toast.success("Area added successfully");
      })
      .catch((error) => {
        console.error("Failed to save area:", error);
      });
    setIsDialogOpen(false);
    setAreaName("");
    setAreaDescription(""); // Reset areaDescription after submission
  };

  // Ensure that handleSelectArea function correctly passes the area ID
  const handleSelectArea = (id, areaName, description) => {
    
    setSelectedAreaId(id); // Ensure the correct ID field is set
    console.log("Selected area id:", id); // Log to check if id is defined
    console.log("Area StateL", selectedAreaId)
    setSelectedAreaName(areaName);
  };

// Ensure that the API endpoints for deleting and updating area data are correctly implemented
// Make sure that the correct field names are used for identification

  

  const handleBackToAreas = () => {
    setSelectedAreaId(null);
    setSelectedAreaName("");
  };

  // Function to handle changes in the area description input
  const handleAreaDescriptionChange = (event) => {
    setAreaDescription(event.target.value);
  };

  return (
    <div className="col-span-4 px-6 py-4 h-screen block sm:flex flex-col">
      <Header title="Dashboard" />
      <ToastContainer className="w-11/12 m-4 sm:block sm:w-80 sm:m-0" />
      <div className="overflow-y-auto">
        {selectedAreaId === null ? (
          <div>
            {loading && (
              <div>
                <PulseLoader />
              </div>
            )}
            {areaList.length === 0 ? (
              <p>No Areas currently</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
{areaList.map((val, index) => (
  <div key={index} className="relative">
    <Card
      val={val}
      updatedAreaData={updatedAreaData}
      onSelect={() =>
        handleSelectArea(val.id, val.buildingName)
      }
      
    />
  </div>
))}

              </div>
            )}
            <Add toggleDialog={toggleDialog} text="Area" />
            {isDialogOpen && (
              <ModalOverlay isOpen={isDialogOpen}>
                <Dialog
                  text="Add Area"
                  text2="Area"
                  name={areaName}
                  setName={setAreaName}
                  description={areaDescription} // Passed areaDescription to the Dialog component
                  setDescription={setAreaDescription} // Added setDescription to handle areaDescription changes
                  onClose={toggleDialog}
                  onSubmit={handleSubmitDialog}
                  onDescriptionChange={handleAreaDescriptionChange} // Passed handleAreaDescriptionChange to handle changes in areaDescription
                />
              </ModalOverlay>
            )}
          </div>
        ) : (
          <div>
            <Labs
              parentAreaId={selectedAreaId}
              parentAreaName={selectedAreaName}
              backToAreas={handleBackToAreas}
            />
          </div>
        )}
      </div>
    </div>
  );
}
