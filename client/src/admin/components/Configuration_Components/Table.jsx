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
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [manualStatusMap, setManualStatusMap] = useState(new Map());

  useEffect(() => {
    setLoading(true);
    Axios.get(
      `http://localhost:3001/readCameraWithManualStatus/${selectedCamera}/readBoundedRectangles`
    )
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setEditableData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [selectedCamera]);

  useEffect(() => {
    const newMap = new Map();
    data.forEach((row) => {
      newMap.set(row.RectangleID, !!row.Manual_Status);
    });
    console.log("Manual Status Map:", newMap); // Debugging
    setManualStatusMap(newMap);
  }, [data]);

  const handleRowSelectionChange = (row) => {
    const newSelectedRowId = row.original.RectangleID;
    setSelectedRowId((prevSelectedRowId) =>
      prevSelectedRowId === newSelectedRowId ? null : newSelectedRowId
    );
    onSelectedRectangleChange(
      selectedRowId === newSelectedRowId ? null : newSelectedRowId
    );
  };

  const updateManualStatus = (rectangleId, newManualStatus) => {
    Axios.put(`http://localhost:3001/updateManualStatus/${rectangleId}`, {
      Manual_Status: newManualStatus ? 1 : 0,
    })
      .then((response) => {
        console.log(response.data);
        const newMap = new Map(manualStatusMap);
        newMap.set(rectangleId, newManualStatus);
        setManualStatusMap(newMap);
      })
      .catch((error) => {
        console.error("Failed to update manual status:", error);
      });
  };

  const handleDeleteSelectedRow = () => {
    if (selectedRowId) {
      Axios.delete(
        `http://localhost:3001/deleteBoundedRectangle/${selectedRowId}`
      )
        .then((response) => {
          console.log(response);
          setData((prevData) =>
            prevData.filter((row) => row.RectangleID !== selectedRowId)
          );
          setEditableData((prevData) =>
            prevData.filter((row) => row.RectangleID !== selectedRowId)
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

  useEffect(() => {
    setButtonDisabled(selectedRowId === null);
  }, [setButtonDisabled, selectedRowId]);

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
      cell: ({ row }) => (
        <button
          type="button"
          className={`${
            manualStatusMap.get(row.original.RectangleID)
              ? "bg-green-500"
              : "bg-gray-300"
          } w-12 h-6 rounded-full focus:outline-none`}
          onClick={() =>
            updateManualStatus(
              row.original.RectangleID,
              !manualStatusMap.get(row.original.RectangleID)
            )
          }
        >
          <span
            className={`${
              manualStatusMap.get(row.original.RectangleID)
                ? "translate-x-3"
                : "-translate-x-3"
            } m-1 inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform`}
          />
        </button>
      ),
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
          className={`flex gap-2 bg-background text-white py-2 px-3 rounded-full transition duration-150 ease-in-out focus:outline-none ${
            buttonDisabled
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-icon hover:text-black"
          }`}
          disabled={buttonDisabled}
        >
          <MaterialSymbolsDelete />
          Delete
        </button>
        <button
          onClick={handleSaveChanges}
          className={`flex gap-2 bg-background text-white py-2 px-3 rounded-full transition duration-150 ease-in-out focus:outline-none ${
            buttonDisabled
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-icon hover:text-black"
          }`}
          disabled={buttonDisabled}
        >
          <UilSave />
          Save
        </button>
      </div>
      {loading ? (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
