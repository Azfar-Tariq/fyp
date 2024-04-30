import { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InsertModel from "../components/Camera/InsertModel";
import EditModel from "../components/Camera/EditModel";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ChevronsRightLeft } from "lucide-react";

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

export default function Cameras() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [rowSelection, setRowSelection] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showInsertModel, setShowInsertModel] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);

  useEffect(() => {
    setLoading(true);
    Axios.get("http://localhost:3001/Cameras")
      .then((response) => {
        setData(response.data);
        setLoading(false);
        // console.log(response.data)
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);
  
  const fetchData = async (setCameraList) => {
    try {
      const response = await Axios.get("http://localhost:3001/Cameras");
      setCameraList(response.data);
      // console.log(response.data);
    } catch (err) {
      console.error("Failed to get Cameras:", err);
    }
  };
  const handleRowSelectionChange = (row) => {
    const newSelectedRowId = row.original.CameraID;
    setSelectedRowId((prevSelectedRowId) =>
      prevSelectedRowId === newSelectedRowId ? null : newSelectedRowId
      
    );
    // console.log(row.original.CameraID)

    const selectedRow = data.find((rowData) => rowData.CameraID === newSelectedRowId);
    // console.log(selectedRow.CameraID);
    setSelectedCamera(selectedRow.CameraID);
  };

  //................................... Add Cameras...............................................
    // Define event handler to toggle insert model visibility
    const toggleInsertModel = () => {
      setShowInsertModel(!showInsertModel);
    };



  // .................................Edit Camera Data..........................................
  const handleEditCamera = () => {
    // const selectedRow = data.find((row) => row.id === selectedRowId);
    if (selectedRowId) {
      setEditing(true);
      setSelectedCamera(selectedRowId);
      setShowEditModel(true); // Show the EditModel
    }
  };

  const handleEditCameraSave = (updatedCamera) => {
    Axios.put(`http://localhost:3001/updateCamera/${selectedRowId}`, updatedCamera)
      .then((response) => {
        setData(
          data.map((Camera) =>
            Camera.id === selectedRowId ? updatedCamera : Camera
          )
        );
        setEditing(false);
        toast.success("Camera Data updated Successfully");
        setShowEditModel(false); // Close the EditModel after saving
      })
      .catch((error) => {
        console.error("Error updating Camera", error);
      });
  };


  //........................................Delete Selecte Camera.....................................

  const handleDeleteSelectedRow = () => {
    if (selectedRowId) {
      Axios.delete(`http://localhost:3001/deleteCamera/${selectedRowId}`)
        .then((response) => {
          setData((prevData) => prevData.filter((row) => row.id !== selectedRowId));
          setSelectedRowId(null);
          fetchData(setData); // Fetch updated data from the server
          toast.success("Camera Deleted Successfully");
        })
        .catch((error) => {
          console.error(`Error deleting Camera ${selectedRowId}`, error);
        });
    }
  };

  const columns = [
    {
      id: "select",
      cell: ({ row }) => {
        return (
          <IndeterminateCheckbox
            checked={selectedRowId === row.original.CameraID}
            onChange={() => handleRowSelectionChange(row)}
          />
        );
      },
    },
    {
      Header: "Camera Name",
      accessorKey: "CameraName",
    },
    {
      Header: "Description",
      accessorKey: "CameraDescription",
    },
    {
      Header: "Associated Area",
      accessorKey: "AreaName",
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
      rowSelection,
    },
    onSortingChange: setSorting,
    onFilteringChange: setFiltering,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  return (
    <div className="w3-container mx-auto px-8 py-8">
    <div className="flex flex-col gap-4 mb-4">
      <div className="relative">
        <label htmlFor="filter" className="sr-only">
          Search:
        </label>
        <input
          id="filter"
          type="text"
          className="bg-gray-100 border border-gray-300 py-2 px-4 rounded focus:outline-none focus:border-purple-400"
          placeholder="Search..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading ...</div>
      ) : (
<table className="w-full border-collapse px-12">
  <thead>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            onClick={header.column.getToggleSortingHandler()}
            className="py-2 px-4 text-left bg-gray-200 border-b border-gray-300 cursor-pointer"
          >
            {header.column.columnDef.Header}
            {
              {
                asc: "▲",
                desc: "▼",
              }[header.column.getIsSorted() ?? null]
            }
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row, rowIndex) => (
      <tr
        key={row.id}
        className={`${
          rowIndex % 2 === 0 ? "bg-white" : "bg-teal-50"
        } hover:bg-gray-200 cursor-pointer`}
      >
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            className="py-2 px-4 border-b border-gray-300"
          >
            {cell.column.columnDef.cell(cell)}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>


      )}
    </div>

<div className="flex justify-center items-center gap-4 mt-4 ">
<ToastContainer />
      <button
        onClick={() => table.setPageIndex(0)}
        className="flex items-center  gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        First Page
      </button>
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
        className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Previous Page
      </button>
      <button
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
        className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Next Page
      </button>
      <button
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      >
        Last Page
      </button>
    </div>

    <div className="flex justify-center gap-4 mt-4">
      <button
        className="text-white w-28 h-12 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={toggleInsertModel}
      >
        Add
      </button>
      <button className="focus:outline-none w-28 h-12 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
       onClick={handleEditCamera}>
Edit

</button>

      <button type="button" className="focus:outline-none  w-28 h-12 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
       onClick={handleDeleteSelectedRow}
      >
        Delete
        </button>

       {/* Insert Model */}
       <InsertModel
        isOpen={showInsertModel} // Pass state variable to manage visibility
        onClose={toggleInsertModel} // Pass event handler to close the insert model
        onSave={(newCamera) => {
          // Handle save logic here if needed
          console.log("New camera saved:", newCamera);
        }}
      />

        {/* Edit Model */}
        <EditModel
        isOpen={showEditModel} // Pass state variable to manage visibility
        onClose={() => setShowEditModel(false)} // Pass event handler to close the edit model
        selectedCamera={selectedCamera} // Pass the selected camera data
        onSave={handleEditCameraSave} // Pass event handler to save edited camera data
      />
    </div>
  </div>
  );
}
