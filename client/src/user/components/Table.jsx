import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Axios from "axios";
import { useEffect, useState } from "react";

const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS;

export default function Table({ selectedCamera }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [manualStatusMap, setManualStatusMap] = useState(new Map());

  useEffect(() => {
    setLoading(true);
    Axios.get(
      `${HOST_ADDRESS}/readCameraWithManualStatus/${selectedCamera}/readBoundedRectangles`
    )
      .then((response) => {
        console.log(response.data);
        setData(response.data);
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

  const updateManualStatus = (rectangleId, newManualStatus) => {
    Axios.put(`${HOST_ADDRESS}/updateManualStatus/${rectangleId}`, {
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

  const columns = [
    {
      header: "Rectangle ID",
      accessorKey: "RectangleID",
    },
    {
      header: "X1",
      accessorKey: "x1",
    },
    {
      header: "Y1",
      accessorKey: "y1",
    },
    {
      header: "X2",
      accessorKey: "x2",
    },
    {
      header: "Y2",
      accessorKey: "y2",
    },
    {
      header: "Automation Type",
      accessorKey: "Manual_Status",
      cell: ({ row }) => (
        <div className="flex gap-2">
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
          {manualStatusMap.get(row.original.RectangleID)
            ? "Manual"
            : "Automatic"}
        </div>
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
    },
    onSortingChange: setSorting,
    onFilteringChange: setFiltering,
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
