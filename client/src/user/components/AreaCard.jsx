
export default function AreaCard({ val, onSelect }) {
  
  return (
    <div>
      <div
  className="border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer"
  onClick={() => {
    onSelect(val.areaId, val.areaName, val.description);
  }}
>
        <div className="p-4 flex justify-between items-center">
          <div>
            <p className="text-xl font-bold tracking-tight text-white">
              {val.areaName}
            </p>
            <p className="text-sm text-gray-400">{val.description}</p>
          </div>
        </div>
      </div>

    </div>
  );
}