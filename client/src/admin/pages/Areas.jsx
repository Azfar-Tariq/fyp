import { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InsertAreaModal from "../components/Area/InsertAreaModal";
import EditAreaModal from "../components/Area/EditAreaModal";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { MaterialSymbolsDelete } from "../assets/icons/delete";
import { MaterialSymbolsEditOutlineRounded } from "../assets/icons/edit";
import { MaterialSymbolsAddRounded } from "../assets/icons/add";

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
  const [selectedArea, setSelectedArea] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [rowSelection, setRowSelection] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    Axios.get("http://localhost:3001/readArea")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const fetchData = async (setAreaList) => {
    try {
      const response = await Axios.get("http://localhost:3001/readArea");
      setAreaList(response.data);
    } catch (err) {
      console.error("Failed to get Areas:", err);
    }
  };

  const handleRowSelectionChange = (row) => {
    const newSelectedRowId = row.original.areaId;
    setSelectedRowId((prevSelectedRowId) =>
      prevSelectedRowId === newSelectedRowId ? null : newSelectedRowId
    );

    const selectedRow = data.find(
      (rowData) => rowData.areaId === newSelectedRowId
    );
    setSelectedArea(selectedRow);
  };

  // Add Area Modal Toggle
  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  const handleAddAreaSave = (newArea) => {
    Axios.post("http://localhost:3001/insertArea", newArea)
      .then((response) => {
        setData((prevData) => [...prevData, newArea]);
        toast.success("New Area Added Successfully");
        setShowAddModal(false); // Close the AddModal after saving
      })
      .catch((error) => {
        console.error("Error adding area", error);
      });
  };

  const handleEditAreaSave = (updatedArea) => {
    Axios.put(
      `http://localhost:3001/updateArea/${selectedArea.areaId}`,
      updatedArea
    )
      .then((response) => {
        const updatedData = data.map((area) =>
          area.areaId === selectedArea.areaId
            ? { ...area, ...updatedArea }
            : area
        );
        setData(updatedData);
        toast.success("Area Updated Successfully");
        setShowEditModal(false); // Close the EditModal after saving
      })
      .catch((error) => {
        console.error("Error updating area", error);
      });
  };

  const handleDeleteSelectedRow = () => {
    if (selectedRowId) {
      Axios.delete(`http://localhost:3001/deleteArea/${selectedRowId}`)
        .then((response) => {
          setData((prevData) =>
            prevData.filter((row) => row.areaId !== selectedRowId)
          );
          setSelectedRowId(null);
          fetchData(setData); // Fetch updated data from the server
          toast.success("Area Deleted Successfully");
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
      Header: "Description",
      accessorKey: "description",
    },
    {
      Header: "Address",
      accessorKey: "address",
    },
    {
      Header: "Focal Person",
      accessorKey: "focalPerson",
    },
    {
      Header: "Contact",
      accessorKey: "contact",
    },
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
    <div className="w-full">
      <div className="flex flex-col gap-4 my-4">
        <div className="relative">
          <label htmlFor="filter" className="sr-only">
            Search:
          </label>
          <input
            id="filter"
            type="text"
            className="py-2 px-4 bg-background text-white rounded focus:outline-none"
            placeholder="Search..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
          />
        </div>

        {loading ? (
          <div>Loading ...</div>
        ) : (
          <table className="w-full bg-background text-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="py-2 px-4 text-left cursor-pointer"
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
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-2 px-4">
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
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-white uppercase align-middle transition-all rounded-full select-none bg-background hover:bg-icon hover:text-black active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          First Page
        </button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-white uppercase align-middle transition-all rounded-full select-none bg-background hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Previous Page
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-white uppercase align-middle transition-all rounded-full select-none bg-background hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Next Page
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-white uppercase align-middle transition-all rounded-full select-none bg-background hover:bg-icon hover:text-black active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Last Page
        </button>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <button
          className="bg-background text-white flex p-3 gap-2 rounded-lg hover:bg-icon hover:text-black duration-150"
          onClick={toggleAddModal}
        >
          <MaterialSymbolsAddRounded />
          Add
        </button>
        <button
          className="bg-background text-white flex p-3 gap-2 rounded-lg hover:bg-icon hover:text-black duration-150"
          onClick={toggleEditModal}
        >
          <MaterialSymbolsEditOutlineRounded />
          Edit
        </button>

        <button
          type="button"
          className="bg-background text-white flex p-3 gap-2 rounded-lg hover:bg-icon hover:text-black duration-150"
          onClick={handleDeleteSelectedRow}
        >
          <MaterialSymbolsDelete />
          Delete
        </button>

        {/* Add Area Modal */}
        <InsertAreaModal
          isOpen={showAddModal}
          onClose={toggleAddModal}
          onSave={handleAddAreaSave}
        />

        {/* Edit Area Modal */}
        {selectedArea && (
          <EditAreaModal
            isOpen={showEditModal}
            onClose={toggleEditModal}
            onSave={handleEditAreaSave}
            area={selectedArea}
          />
        )}
      </div>
    </div>
  );
}
