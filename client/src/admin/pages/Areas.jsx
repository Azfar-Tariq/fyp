// /* eslint-disable no-unused-vars */
// import { useEffect, useState } from "react";
// import Add from "../components/Add";
// import Card from "../components/Area_Components/Card";
// import Dialog from "../components/Dialog";
// import Axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import ModalOverlay from "../components/ModalOverlay";
// import { PulseLoader } from "react-spinners";

// const fetchData = async (setAreaList) => {
//   try {
//     const response = await Axios.get("http://localhost:3001/readArea");
//     setAreaList(response.data);
//   } catch (err) {
//     console.error("Failed to get Areas:", err);
//   }
// };

// export default function Dashboard() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [areaName, setAreaName] = useState("");
//   const [areaList, setAreaList] = useState([]);
//   const updatedAreaData = () => {
//     fetchData(setAreaList);
//   };

//   useEffect(() => {
//     Axios.get("http://localhost:3001/readArea")
//       .then((response) => {
//         setAreaList(response.data);
//       }, [])
//       .catch((err) => {
//         console.error("Failed to get Areas:", err);
//       });
//   }, []);

//   const toggleDialog = () => {
//     setIsDialogOpen(!isDialogOpen);
//   };
//   const deleteArea = (id) => {
//     Axios.delete(`http://localhost:3001/deletearea/${id}`)
//       .then((res) => {
//         console.log(res.data);
//         updatedAreaData();
//         toast.success("Area deleted successfully");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const openEditDialog = (area) => {
//     setEditAreaName(area.areaName);
//     setIsEditDialogOpen(true);
//   };



//   const handleSubmitDialog = (area) => {
//     Axios.post("http://localhost:3001/insertArea", {
//       areaName: areaName,
//     })
//       .then((response) => {
//         console.log(response.data);
//         updatedAreaData();
//         toast.success("Area added successfully");
//       })
//       .catch((error) => {
//         console.error("Failed to save Area:", error);
//       });
//     setIsDialogOpen(false);
//     setAreaName("");
//     Axios.put(`http://localhost:3001/updateArea/${area.id}`, {
//       newAreaName: editAreaName,
//     })
//       .then((res) => {
//         console.log(res.data);
//         updatedAreaData();
//         toast.success("Area updated successfully");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     setIsEditDialogOpen(false);
//   };

//   return (
//     <div className="col-span-4 px-6 py-4 h-screen block sm:flex flex-col">
//       <ToastContainer className="w-11/12 m-4 sm:block sm:w-80 sm:m-0" />
//       <div className="overflow-y-auto">
//         <div>
//           {areaList.length === 0 ? (
//             <p>No Areas currently</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {areaList.map((val, index) => (
//                 <div key={index} className="relative">
//                   <Card
//                     val={val}
//                     updatedAreaData={updatedAreaData}
//                     onClick={() => openEditDialog(val)}
//                     onDelete={() => deleteArea(val.id)}
//                   />
//                 </div>
//               ))}
//             </div>
//           )}
//           <Add toggleDialog={toggleDialog} text="Area" />
//           {isDialogOpen && (
//             <ModalOverlay isOpen={isDialogOpen}>
//               <Dialog
//                 text="Add Area"
//                 text2="Area"
//                 name={areaName}
//                 setName={setAreaName}
//                 onClose={() => setIsDialogOpen(false)}
//                 onSubmit={handleSubmitDialog}
//               />
//             </ModalOverlay>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useRef } from "react";
import Axios from "axios";
import AddAreaForm from "../components/Area_Components/AddAreaForm"
import EditAreaForm from "../components/Area_Components/EditAreaForm"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

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

export default function Areas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [rowSelection, setRowSelection] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Axios.get("http://localhost:3001/readArea")
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

  const handleRowSelectionChange = (row) => {
    const newSelectedRowId = row.original.areaId;
    setSelectedRowId((prevSelectedRowId) =>
      prevSelectedRowId === newSelectedRowId ? null : newSelectedRowId
    );
    
    const selectedRow = data.find((rowData) => rowData.areaId === newSelectedRowId);
    // console.log(selectedRow.areaId);
    setSelectedArea(selectedRow.areaId);
  };
  
  const handleAdd = () => {
    setShowAddForm(true);
  };

  const handleAddFormClose = () => {
    setShowAddForm(false);
  };

  const handleAddFormSave = (newArea) => {
    Axios.post("http://localhost:3001/insertArea", newArea)
      .then((response) => {
        setData((prevData) => [...prevData, response.data]);
        setShowAddForm(false);
      })
      .catch((error) => {
        console.error("Error creating area", error);
      });
  };
  console.log("selected Area",selectedArea)
  console.log("selected  Row",selectedRowId)
  const handleEditArea = () => {
    const selectedRow = data.find((row) => row.id === selectedRowId);
    // setSelectedArea(selectedRowId);
<<<<<<< HEAD

    if (selectedRow) {
      
      setShowEditForm(true);
    }
  };
  const handleEditAreaSave = (updatedArea) => {
    Axios.put(`http://localhost:3001/updateArea/${selectedRowId}`, updatedArea)
    console.log(updatedArea)

      .then((response) => {
        setData((prevData) =>
          prevData.map(() =>
             response.data 
            
          )
          
        );
        console.log(response.data)
        setShowEditForm(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };
=======
>>>>>>> parent of 8e852f88 (Worked on Edit area Funnctionality)

    if (selectedRow) {
      
      setShowEditForm(true);
    }
  };
  const handleEditAreaSave = (updatedArea) => {
    Axios.put(`http://localhost:3001/updateArea/${selectedRowId}`, updatedArea)
    console.log(updatedArea)

      .then((response) => {
        setData((prevData) =>
          prevData.map(() =>
             response.data 
            
          )
          
        );
        console.log(response.data)
        setShowEditForm(false);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };

  const handleDeleteSelectedRow = () => {
    if (selectedRowId) {
      Axios.delete(`http://localhost:3001/deletearea/${selectedRowId}`)
        .then((response) => {
          setData((prevData) =>
            prevData.filter((row) => row.id !== selectedRowId)
          );
          setSelectedRowId(null);
        })
        .catch((error) => {
          console.error(`Error deleting area ${selectedRowId}`, error);
        });
    }
  };

  const columns = [
    {
      id: "select",
      cell: ({ row }) => {
        return (
          <IndeterminateCheckbox
            checked={selectedRowId === row.original.areaId}
            onChange={() => handleRowSelectionChange(row)}
          />
        );
      },
    },
    {
      Header: "Area Name",
      accessorKey: "areaName",
    },
    {
      Header: "Area Description",
      accessorKey: "description",
    },
    {
      Header: "Area Address",
      accessorKey: "address",
    },
    {
      Header: "Focal Person",
      accessorKey: "focalPerson",
    },
    {
      Header: "Contact Number",
      accessorKey: "contact",
    },
    // Add other columns as needed
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
    if (editing) {
      return <AreaForm onSave={handleEditArea} initialValues={[editing]} />;
    }
  });

  return (
    <div className="w3-container mx-auto px-4 py-8">
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
          <table className="w-full border-collapse border border-gray-300">
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
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`${
                    selectedRowId === row.original.areaId ? "bg-gray-100" : ""
                  } hover:bg-gray-50 cursor-pointer`}
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
  
      {showAddForm && (
        <AddAreaForm onSave={handleAddFormSave} onClose={handleAddFormClose} />
      )}
      {showEditForm && selectedArea && (
        <EditAreaForm
          onSave={handleEditAreaSave}
          onClose={() => setShowEditForm(false)}
          defaultValues={selectedArea}
          title="Edit Area"
        />
      )}
  
  <div className="flex justify-center items-center gap-4 mt-2">
        <button
          onClick={() => table.setPageIndex(0)}
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-full select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
          className="px-6 py-2 text-xs font-semibold text-gray-900 uppercase bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          className="px-6 py-2 text-xs font-semibold text-gray-900 uppercase bg-yellow-500 rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={() => setShowEditForm(true)}
        >
          Edit
        </button>
        <button
          className="px-6 py-2 text-xs font-semibold text-gray-900 uppercase bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={handleDeleteSelectedRow}
        >
          Delete
        </button>
      </div>
    </div>
  );
  
}
