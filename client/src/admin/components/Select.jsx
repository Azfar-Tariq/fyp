import { useState } from "react";
import { nodes } from "../data";
import { IcOutlineKeyboardArrowDown } from "../assets/icons/down";
import { MaterialSymbolsArrowForwardIosRounded } from "../assets/icons/foward";

export default function Select() {
  const [selectedArea, setSelectedArea] = useState(null);

  const handleAreaClick = (areaName) => {
    setSelectedArea(areaName === selectedArea ? null : areaName);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold">Areas</h2>
      <ul>
        {nodes.map((node) => (
          <div
            key={node.id}
            className="flex cursor-pointer"
            onClick={() => handleAreaClick(node.areaName)}
          >
            <IcOutlineKeyboardArrowDown />
            <li
              className={`${
                selectedArea === node.areaName ? " font-semibold" : ""
              }`}
            >
              {node.areaName}
              {selectedArea === node.areaName && (
                <div className="flex">
                  <MaterialSymbolsArrowForwardIosRounded />
                  <ul className="pl-4">
                    {nodes
                      .filter((node) => node.areaName === selectedArea)
                      .map((node) => (
                        <li key={node.id}>{node.cameraName}</li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}
