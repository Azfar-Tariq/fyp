import Table from "../components/Table";
import Select from "../components/Select";

export default function Configuration() {
  return (
    <div className="py-6 px-4 flex flex-col h-full overflow-y-auto">
      <div className="flex-1">
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            Configuration
            <img src="https://dummyimage.com/800x800" alt="" />
          </div>
          <div className="col-span-1">
            <Select />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Table />
      </div>
    </div>
  );
}
