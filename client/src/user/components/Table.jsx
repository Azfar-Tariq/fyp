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
import { MaterialSymbolsDelete } from "./../assets/icons/delete";

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

  useEffect(() => {
    setLoading(true);
    Axios.get(
      `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
    )
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [selectedCamera]);

  const handleRowSelectionChange = (row) => {
    // setSelectedRowId(row.original.RectangleID);
    // onSelectedRectangleChange(row.original.RectangleID);
    const newSelectedRowId = row.original.RectangleID;
    setSelectedRowId((prevSelectedRowId) =>
      prevSelectedRowId === newSelectedRowId ? null : newSelectedRowId
    );
    onSelectedRectangleChange(
      selectedRowId === newSelectedRowId ? null : newSelectedRowId
    );
  };

  const handleDeleteSelectedRow = () => {
    if (selectedRowId) {
      console.log(selectedRowId);
      Axios.delete(
        `http://localhost:3001/deleteBoundedRectangle/${selectedRowId}`
      )
        .then((response) => {
          console.log(response);
          setData((prevData) =>
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
      header: "Status",
      accessorKey: "Status",
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
            className="bg-purple-50 border border-gray-300 py-2 px-4 rounded focus:outline-none focus:border-purple-400"
            placeholder="Search..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
          />
        </div>
        <button
          onClick={handleDeleteSelectedRow}
          className="bg-purple-500 p-2 rounded-full hover:bg-purple-700 transition duration-100 ease-in-out focus:outline-none"
        >
          <MaterialSymbolsDelete />
        </button>
      </div>
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <table className="w3-table-all">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
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
                  <td key={cell.id}>
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
    </div>
  );
}
