import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { nodes } from "../data";
import { useState } from "react";

export default function Table() {
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  let data = { nodes };

  data = {
    nodes: data.nodes.filter((item) =>
      item.areaName.toLowerCase().includes(search.toLowerCase())
    ),
  };

  const theme = useTheme([
    getTheme(),
    {
      HeaderRow: `
        background-color: #eaf5fd;
      `,
      Row: `
        &:nth-of-type(odd) {
          background-color: #d2e9fb;
        }

        &:nth-of-type(even) {
          background-color: #eaf5fd;
        }
      `,
    },
  ]);

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        TASK: (array) =>
          array.sort((a, b) => a.areaName.localeCompare(b.areaName)),
        CAMERA: (array) =>
          array.sort((a, b) => a.cameraName.localeCompare(b.cameraName)),
        RECTANGLE_ID: (array) =>
          array.sort((a, b) => a.boundedRectangleId - b.boundedRectangleId),
        X1: (array) => array.sort((a, b) => a.x1 - b.x1),
        Y1: (array) => array.sort((a, b) => a.y1 - b.y1),
        X2: (array) => array.sort((a, b) => a.x2 - b.x2),
        Y2: (array) => array.sort((a, b) => a.y2 - b.y2),
      },
    }
  );

  function onSortChange(action, state) {
    console.log(action, state);
  }

  const COLUMNS = [
    {
      label: "Task",
      renderCell: (item) => item.areaName,
      sort: { sortKey: "TASK" },
      resize: true,
    },
    {
      label: "Camera",
      renderCell: (item) => item.cameraName,
      sort: { sortKey: "CAMERA" },
      resize: true,
    },
    {
      label: "Rectangle ID",
      renderCell: (item) => item.boundedRectangleId,
      sort: { sortKey: "RECTANGLE_ID" },
      resize: true,
    },
    {
      label: "X1",
      renderCell: (item) => item.x1,
      sort: { sortKey: "X1" },
      resize: true,
    },
    {
      label: "Y1",
      renderCell: (item) => item.y1,
      sort: { sortKey: "Y1" },
      resize: true,
    },
    {
      label: "X2",
      renderCell: (item) => item.x2,
      sort: { sortKey: "X2" },
      resize: true,
    },
    {
      label: "Y2",
      renderCell: (item) => item.y2,
      sort: { sortKey: "Y2" },
      resize: true,
    },
  ];

  return (
    <div>
      <label htmlFor="search" className="p-3">
        Search by Task:&nbsp;
        <input
          id="search"
          type="text"
          className="border border-gray-400 rounded-md"
          value={search}
          onChange={handleSearch}
        />
      </label>
      <div className="m-2">
        <CompactTable columns={COLUMNS} data={data} theme={theme} sort={sort} />
      </div>
    </div>
  );
}
