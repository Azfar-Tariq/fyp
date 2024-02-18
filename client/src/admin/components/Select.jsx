export default function Select() {
  return (
    <div className="flex flex-col">
      <label htmlFor="area">Select Area</label>
      <select
        id="area"
        name="area"
        className="border border-gray-300 rounded-md"
      >
        <option value="block1">Block 1</option>
        <option value="block2">Block 2</option>
        <option value="block3">Block 3</option>
      </select>
    </div>
  );
}
