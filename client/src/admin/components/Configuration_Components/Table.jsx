import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Axios from "axios";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { MaterialSymbolsDelete } from "../../assets/icons/delete";
import { UilSave } from "../../assets/icons/save";

function IndeterminateCheckbox({ indeterminate, className = "",...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate =!rest.checked && indeterminate;
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

export default function Table({
  selectedCamera,
  onSelectedRectangleChange,
  onDeleteRectangle,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [rowSelection, setRowSelection] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editableData, setEditableData] = useState([]);
  // const [manualStatusMap, setManualStatusMap] = useState(new Map()); // Add a state to store the manual status map

  useEffect(() => {
  setLoading(true);
  Axios.get(`http://localhost:3001/readCameraWithManualStatus/${selectedCamera}/readBoundedRectangles`)
   .then((response) => {
      setData(response.data);
      setEditableData(response.data);
      setLoading(false);
    })
   .catch((error) => {
      console.error(error);
      setLoading(false);
    });
}, [selectedCamera]);

   const handleRowSelectionChange = (row) => {
    const newSelectedRowId = row.original.RectangleID;
    setSelectedRowId((prevSelectedRowId) =>
      prevSelectedRowId === newSelectedRowId? null : newSelectedRowId
    );
    onSelectedRectangleChange(
      selectedRowId === newSelectedRowId? null : newSelectedRowId
    );
  };

  const updateManualStatus = (newManualStatus) => {
    Axios.put(`http://localhost:3001/updateManualStatus/${selectedRowId}`, {
      Manual_Status: newManualStatus,
    })
      .then((response) => {
        console.log(response.data);
        // Optionally update local state or perform any other actions upon successful update
      })
      .catch((error) => {
        console.error("Failed to update manual status:", error);
      });
  };
  
  const handleDeleteSelectedRow = () => {
    if (selectedRowId) {
      Axios.delete(`http://localhost:3001/deleteBoundedRectangle/${selectedRowId}`)
       .then((response) => {
          console.log(response);
          setData((prevData) =>
            prevData.filter((row) => row.RectangleID!== selectedRowId)
          );
          setEditableData((prevData) =>
            prevData.filter((row) => row.RectangleID!== selectedRowId)
          );
          setSelectedRowId(null);
          onDeleteRectangle();
        })
       .catch((error) => {
          console.error(`Error deleting rectangle ${selectedRowId}`, error);
        });
    }
  };

  const handleInputChange = (e, rowIdx, key) => {
    if (selectedRowId) {
      const newData = [...editableData];
      newData[rowIdx][key] = parseFloat(e.target.value);
      setEditableData(newData);
    }
  };

  const handleSaveChanges = () => {
    console.log("Updated Data:", editableData);
    if (selectedRowId) {
      const selectedRectangle = data.find(
        (rectangle) => rectangle.RectangleID === selectedRowId
      );
      if (selectedRectangle) {
        const { RectangleID, x1, y1, x2, y2 } = selectedRectangle;
        Axios.put(
          `http://localhost:3001/updateBoundedRectangle/${RectangleID}`,
          {
            x1: parseInt(x1),
            y1: parseInt(y1),
            x2: parseInt(x2),
            y2: parseInt(y2),
            status: 0,
          }
        )
         .then((response) => {
            console.log(response.data);
          })
         .catch((error) => {
            console.error("Failed to update rectangle:", error);
          });
      }
    }
  };

  const columns = [
    {
      id: "select",
      cell: ({ row }) => (
        <IndeterminateCheckbox
          checked={selectedRowId === row.original.RectangleID}
          onChange={() => handleRowSelectionChange(row)}
        />
      ),
    },
    {
      header: "Rectangle ID",
      accessorKey: "RectangleID",
    },
    {
      header: "X1",
      accessorKey: "x1",
      cell: ({ row }) => {
        return (
          <input
            type="number"
            value={row.original.x1}
            onChange={(e) => handleInputChange(e, row.index, "x1")}
            className="bg-background text-white w-12 focus:outline-none"
            readOnly={!selectedRowId}
          />
        );
      },
    },
    {
      header: "Y1",
      accessorKey: "y1",
      cell: ({ row }) => {
        return (
          <input
            type="number"
            value={row.original.y1}
            onChange={(e) => handleInputChange(e, row.index, "y1")}
            className="bg-background text-white w-12 focus:outline-none"
            readOnly={!selectedRowId}
          />
        );
      },
    },
    {
      header: "X2",
      accessorKey: "x2",
      cell: ({ row }) => {
        return (
          <input
            type="number"
            value={row.original.x2}
            onChange={(e) => handleInputChange(e, row.index, "x2")}
            className="bg-background text-white w-12 focus:outline-none"
            readOnly={!selectedRowId}
          />
        );
      },
    },
    {
      header: "Y2",
      accessorKey: "y2",
      cell: ({ row }) => {
        return (
          <input
            type="number"
            value={row.original.y2}
            onChange={(e) => handleInputChange(e, row.index, "y2")}
            className="bg-background text-white w-12 focus:outline-none"
            readOnly={!selectedRowId}
          />
        );
      },
    },
    {
      header: "Status",
      accessorKey: "Status",
    },
    {
      header: "Manual Status",
      accessorKey: "Manual_Status",
      cell: ({ row }) => {
        const handleManualStatusChange = (e) => {
          const newManualStatus = e.target.value === "true" ? 1 : 0;
          updateManualStatus(newManualStatus); // Call your function to update status in DB or API
          console.log(newManualStatus);
        };
    
        return (
          <select
            value={row.original.Manual_Status === 0 ? "0" : "1"} // Set default value based on Manual_Status
            onChange={handleManualStatusChange}
            className="bg-background text-white w-full py-1 px-2 rounded focus:outline-none"
            disabled={!selectedRowId}
          >
            <option value="0">Off</option>
            <option value="1">On</option>
          </select>
        );
      },
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
    <div className="w3-container">
      <div className="flex gap-6 items-center mb-2">
        <div className="relative">
          <label htmlFor="filter" className="sr-only">
            Search:
          </label>
          <input
            id="filter"
            type="text"
            className="bg-background text-white py-2 px-4 rounded focus:outline-none"
            placeholder="Search..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
          />
        </div>
        <button
          onClick={handleDeleteSelectedRow}
          className="flex gap-2 bg-background text-white py-2 px-3 rounded-full hover:bg-icon hover:text-black transition duration-150 ease-in-out focus:outline-none"
        >
          <MaterialSymbolsDelete />
          Delete
        </button>
        <button
          onClick={handleSaveChanges}
          className="flex gap-2 bg-background text-white py-2 px-3 rounded-full hover:bg-icon hover:text-black transition duration-150 ease-in-out focus:outline-none"
        >
          <UilSave />
          Save
        </button>
      </div>
      {loading? (
        <div>Loading...</div>
      ) : (
        <table className="w-full table-auto bg-background text-white">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="py-2 px-4 cursor-pointer text-left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {
                      {
                        asc: "▲",
                        desc: "▼",
                      }[header.column.getIsSorted()?? null]
                    }
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={selectedRowId === row.original.RectangleID ? "bg-icon text-black" : ""}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2 px-4">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* <Pagination
        currentPage={table.state.pagination.currentPage}
        totalPages={table.state.pagination.totalPages}
        onPageChange={table.getSetPageHandler()}
      /> */}
    </div>
  );
}

