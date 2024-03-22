export default function AalyticsCard({ val, onClick }) {
    return (
    //     <div className="relative max-w-xs overflow-hidden rounded-2xl shadow-lg group" onClick={onClick}>
    //     <div className="absolute inset-0 flex item-end bg-gradient-to-t from-black/60 to-transparent">
    //       <p className="p4 text-white">
    //         {val.areaName}
    //       </p>
    //     </div>
    //   </div>
      <div className="border rounded-lg shadow bg-gray-800 border-gray-700 cursor-pointer" onClick={onClick}>
        <div className="p-4 flex justify-between items-center">
          <p className="text-xl font-bold tracking-tight text-white">
            {val.areaName}
          </p>
        </div>
      </div>
    );
  }
  