import { MaterialSymbolsNotifications } from "../assets/icons/notification";

const ManualRequestCard = ({ request, onGrant, onDeny }) => {
  return (
    <li className="flex items-center space-x-2">
      <MaterialSymbolsNotifications className="text-gray-600" />
      <span className="font-semibold">
        {request.teacherName} is requesting manual control in {request.labName}, {request.buildingName}
      </span>
      <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => onGrant(request.id)}>
        Grant
      </button>
      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDeny(request.id)}>
        Deny
      </button>
    </li>
  );
};

export default ManualRequestCard;
