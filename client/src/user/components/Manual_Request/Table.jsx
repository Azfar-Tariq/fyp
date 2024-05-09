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
  // onDeleteRectangle,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [rowSelection, setRowSelection] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editableData, setEditableData] = useState([]);

  useEffect(() => {
    setLoading(true);
    Axios.get(
      `http://localhost:3001/readCamera/${selectedCamera}/readBoundedRectangles`
    )
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
      prevSelectedRowId === newSelectedRowId ? null : newSelectedRowId
    );
    onSelectedRectangleChange(
      selectedRowId === newSelectedRowId ? null : newSelectedRowId
    );
  };

  const handleInputChange = (e, rowIdx, key) => {
    if (selectedRowId) {
      const newData = [...editableData];
      newData[rowIdx][key] = parseFloat(e.target.value);
      setEditableData(newData);
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
        {/* <button
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
        </button> */}

        
      </div>
      {loading ? (
        <div>Loading ...</div>
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
