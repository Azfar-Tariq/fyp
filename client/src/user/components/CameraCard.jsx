export default function CameraCard({
  val,
  onSelect,
}) {
return (
    <div>
      <div
        className="border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer"
        onClick={() => onSelect(val.CameraID, val.Description)}
      >
        <div className="flex justify-between items-center p-4">
          <p className="text-xl font-bold tracking-tight text-white">
            {val.Description}
          </p>
        </div>
      </div>
    </div>
  );
}
