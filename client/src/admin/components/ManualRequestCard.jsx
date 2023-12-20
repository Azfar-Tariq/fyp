const ManualRequestCard = ({ request, onGrant, onDeny }) => {
  return (
    <li className="flex items-center space-x-2 p-2 border-b last:border-b-none">
      <span className="font-semibold flex-grow">
        {request.teacherName} is requesting manual control in {request.labName},{" "}
        {request.buildingName}
      </span>
      <div className="flex-shrink-0">
        <button
          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
          onClick={() => onGrant(request.id)}
        >
          Grant
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onDeny(request.id)}
        >
          Deny
        </button>
      </div>
    </li>
  );
};

export default ManualRequestCard;
