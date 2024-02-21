import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useSort } from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import { nodes } from "../data";
import { useState } from "react";

export default function Table({ selectedArea, selectedCamera }) {
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  let data = { nodes };

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 4,
    },
    onChange: onPaginationChange,
  });

  function onPaginationChange(action, state) {
    console.log(action, state);
  }

  if (selectedArea && selectedCamera) {
    const area = nodes.find((node) => node.id === selectedArea);
    if (area) {
      const camera = area.cameras.find((cam) => cam.id === selectedCamera);
      if (camera) {
        data = camera.boundedRectangles.map((rectangle) => ({
          ...rectangle,
          areaName: area.areaName,
          cameraName: camera.cameraName,
        }));
      }
    }
  }

  data = {
    nodes: data.nodes
      .filter((item) => item.id === selectedArea)
      .flatMap((item) => item.cameras)
      .filter((camera) => camera.id === selectedCamera)
      .flatMap((camera) => camera.boundedRectangles),
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
      {selectedArea && <div>Selected Area ID: {selectedArea}</div>}
      {selectedCamera && <div>Selected Camera ID: {selectedCamera}</div>}
      <label htmlFor="search" className="p-3">
        Search by Rectangle:&nbsp;
        <input
          id="search"
          type="text"
          className="border border-gray-400 rounded-md"
          value={search}
          onChange={handleSearch}
        />
      </label>
      <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md">
        Save
      </button>
      <div className="m-2">
        <CompactTable
          columns={COLUMNS}
          data={data}
          theme={theme}
          sort={sort}
          pagination={pagination}
        />
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total Pages: {pagination.state.getTotalPages(data.nodes)}</span>

          <span>
            Page:{" "}
            {pagination.state.getPages(data.nodes).map((_, index) => (
              <button
                key={index}
                type="button"
                className="mx-1 px-1 hover:bg-gray-200 rounded-md"
                style={{
                  fontWeight:
                    pagination.state.page === index ? "bold" : "normal",
                  color: pagination.state.page === index ? "white" : "black",
                  backgroundColor:
                    pagination.state.page === index ? "blueviolet" : "white",
                }}
                onClick={() => pagination.fns.onSetPage(index)}
              >
                {index + 1}
              </button>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
