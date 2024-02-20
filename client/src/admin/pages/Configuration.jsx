import Table from "../components/Table";
import Select from "../components/Select";

export default function Configuration() {
  return (
    <div className="py-6 px-4 grid grid-rows-2 h-full overflow-y-auto">
      <div className="grid grid-cols-4">
        <div className="col-span-3">
          Configuration
          <img src="https://dummyimage.com/800x800" alt="" />
        </div>
        <div className="col-span-1">
          <Select />
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <Table />
      </div>
    </div>
  );
}
