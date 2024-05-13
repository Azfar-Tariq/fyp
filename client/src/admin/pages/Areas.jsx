import { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddAreaForm from "../components/Area/AddAreaForm";
import EditAreaForm from "../components/Area/EditAreaForm";
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
        setData((prevData) => [...prevData, newArea]);
        setShowAddForm(false);
        toast.success("New Area Has been Added Successfully");
      })
      .catch((error) => {
        console.error("Error creating area", error);
      });
  };

  const handleEditArea = () => {
    const selectedRow = data.find((row) => row.id === selectedRowId);

    if (selectedRow) {
      setEditing(true);
      setSelectedArea(selectedRow);
    }
  };
  const fetchSelectedArea = async (id) => {
    const response = await Axios.get(`http://localhost:3001/readArea/${id}`);
    return response.data[0];
  };
  const handleEdit = async (id) => {
    const selectedArea = await fetchSelectedArea(id);
    setSelectedArea(selectedArea);
    setShowEditForm(true);
  };

  const handleEditAreaSave = (updatedArea) => {
    Axios.put(`http://localhost:3001/updateArea/${selectedRowId}`, updatedArea)
      .then((response) => {
        setData(
          data.map((area) => (area.id === selectedRowId ? updatedArea : area))
        );
        setEditing(false);
        toast.success("Area Data has been Saved Successfully");
      })
      .catch((error) => {
        console.error("Error updating area", error);
      });
  };
  const handleEditAreaCancel = () => {
    setEditing(false);
  };

  const handleDeleteSelectedRow = () => {
    if (selectedRowId) {
      Axios.delete(`http://localhost:3001/deletearea/${selectedRowId}`)
        .then((response) => {
          setData((prevData) =>
            prevData.filter((row) => row.id !== selectedRowId)
          );
          setSelectedRowId(null);
          fetchData(setData); // Fetch updated data from the server
          toast.success("Area has been Deleted Successfully");
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
  });

  return (
    <div className="w3-container">
      <div className="flex flex-col gap-4 my-4">
        <div className="relative">
          <label htmlFor="filter" className="sr-only">
            Search:
          </label>
          <input
            id="filter"
            type="text"
            className="py-2 px-4 rounded focus:outline-none"
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

      <div className="flex justify-center items-center gap-4 mt-2">
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

      <div className="flex justify-center gap-4 mt-4">
        <button
          className="text-white w-28 h-12 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          className="text-white w-28 h-12 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
          onClick={() => setShowEditForm(true)}
        >
          Edit
        </button>
        <button
          className="text-white w-28 h-12 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-900"
          onClick={handleDeleteSelectedRow}
        >
          Delete
        </button>
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
    </div>
  );
}
