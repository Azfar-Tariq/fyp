import { MaterialSymbolsAddRounded } from "../assets/icons/add";

export default function Add({ toggleDialog, text }) {
  return (
    <div className="mt-4">
      <button
        className="text-white text-md rounded-lg p-3 text-center inline-flex gap-3 items-center bg-purple-500 hover:bg-purple-700 transition duration-100 ease-in-out"
        onClick={toggleDialog}
      >
        <MaterialSymbolsAddRounded />
        Add {text}
      </button>
    </div>
  );
}
