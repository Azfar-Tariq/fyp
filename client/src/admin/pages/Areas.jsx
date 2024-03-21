/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Add from "../components/Add";
import Card from "../components/Area_Components/Card";
import Dialog from "../components/Dialog";
import Axios from "axios";
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
  const [areaList, setAreaList] = useState([]);
  const updatedAreaData = () => {
    fetchData(setAreaList);
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setAreaList(response.data);
      }, [])
      .catch((err) => {
        console.error("Failed to get Areas:", err);
      });
  }, []);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  const deleteArea = (id) => {
    Axios.delete(`http://localhost:3001/deletearea/${id}`)
      .then((res) => {
        console.log(res.data);
        updatedAreaData();
        toast.success("Area deleted successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openEditDialog = (area) => {
    setEditAreaName(area.areaName);
    setIsEditDialogOpen(true);
  };



  const handleSubmitDialog = (area) => {
    Axios.post("http://localhost:3001/insertArea", {
      areaName: areaName,
    })
      .then((response) => {
        console.log(response.data);
        updatedAreaData();
        toast.success("Area added successfully");
      })
      .catch((error) => {
        console.error("Failed to save Area:", error);
      });
    setIsDialogOpen(false);
    setAreaName("");
    Axios.put(`http://localhost:3001/updateArea/${area.id}`, {
      newAreaName: editAreaName,
    })
      .then((res) => {
        console.log(res.data);
        updatedAreaData();
        toast.success("Area updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    setIsEditDialogOpen(false);
  };

  return (
    <div className="col-span-4 px-6 py-4 h-screen block sm:flex flex-col">
      <ToastContainer className="w-11/12 m-4 sm:block sm:w-80 sm:m-0" />
      <div className="overflow-y-auto">
        <div>
          {areaList.length === 0 ? (
            <p>No Areas currently</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {areaList.map((val, index) => (
                <div key={index} className="relative">
                  <Card
                    val={val}
                    updatedAreaData={updatedAreaData}
                    onClick={() => openEditDialog(val)}
                    onDelete={() => deleteArea(val.id)}
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
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleSubmitDialog}
              />
            </ModalOverlay>
          )}
        </div>
      </div>
    </div>
  );
}
