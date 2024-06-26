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

const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS;

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
      `${HOST_ADDRESS}/readCameraWithManualStatus/${selectedCamera}/readBoundedRectangles`
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
      newMap.set(row.RectangleID, {
        Mode1: !!row.Mode1,
        Mode2: !!row.Mode2,
        Mode3: !!row.Mode3,
      });
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

  // const updateManualStatus = async (rectangleId, modeKey, newManualStatus) => {
  //   try {
  //     await Axios.put(
  //       `${HOST_ADDRESS}/updateStatus/${rectangleId}/${modeKey}`,
  //       {
  //         status: newManualStatus,
  //       }
  //     );
  //     const newMap = new Map(manualStatusMap);
  //     newMap.set(rectangleId, {
  //       ...newMap.get(rectangleId),
  //       [modeKey]: newManualStatus,
  //     });
  //     setManualStatusMap(newMap);
  //   } catch (error) {
  //     console.error("Failed to update manual status:", error);
  //   }
  // };

  // const handleManualStatusUpdate = (rectangleId, modeKey, currentStatus) => {
  //   updateManualStatus(rectangleId, modeKey, !currentStatus);
  // };

  const handleDeleteSelectedRow = () => {
    if (selectedRowId) {
      Axios.delete(`${HOST_ADDRESS}/deleteBoundedRectangle/${selectedRowId}`)
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

      // const rectangleId = newData[rowIdx].RectangleID;
      // const modeKey =
      //   key === "Mode1" ? "Mode1" : key === "Mode2" ? "Mode2" : "Mode3";
      // const newManualStatus = e.target.value !== "0"; // Convert 0 to false, other values to true
      // updateManualStatus(rectangleId, modeKey, newManualStatus);
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
        Axios.put(`${HOST_ADDRESS}/updateBoundedRectangle/${RectangleID}`, {
          x1: parseInt(x1),
          y1: parseInt(y1),
          x2: parseInt(x2),
          y2: parseInt(y2),
          status: 0,
        })
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
    // {
    //   header: "Automation Type",
    //   accessorKey: "Manual_Status",
    //   cell: ({ row }) => (
    //     <div className="flex gap-2">
    //       {["Mode1", "Mode2", "Mode3"].map((modeKey) => (
    //         <div key={modeKey} className="flex gap-2 items-center">
    //           {modeKey === "Mode1"
    //             ? "Socket 1"
    //             : modeKey === "Mode2"
    //             ? "Socket 2"
    //             : "Socket 3"}
    //           <button
    //             type="button"
    //             className={`${
    //               manualStatusMap.get(row.original.RectangleID)?.[modeKey]
    //                 ? "bg-green-500"
    //                 : "bg-gray-300"
    //             } w-12 h-6 rounded-full focus:outline-none`}
    //             onClick={() =>
    //               handleManualStatusUpdate(
    //                 row.original.RectangleID,
    //                 modeKey,
    //                 manualStatusMap.get(row.original.RectangleID)?.[modeKey]
    //               )
    //             }
    //           >
    //             <span
    //               className={`${
    //                 manualStatusMap.get(row.original.RectangleID)?.[modeKey]
    //                   ? "translate-x-3"
    //                   : "-translate-x-3"
    //               } m-1 inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform`}
    //             />
    //           </button>
    //         </div>
    //       ))}
    //     </div>
    //   ),
    // },
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
      <div className="flex justify-center items-center gap-4 mt-2">
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
    </div>
  );
}
