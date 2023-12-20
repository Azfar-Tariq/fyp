import { useState } from "react";
import Switch from "react-switch";

const SwitchExample = () => {
  const [checked, setChecked] = useState([false, false, false, false]);

  const handleChange = (index) => (checked) => {
    setChecked((oldChecked) => {
      const newChecked = [...oldChecked];
      newChecked[index] = checked;
      return newChecked;
    });
  };

  return (
    <div className="flex flex-col space-y-2 bg-gray-100 p-2 rounded">
      {checked.map((isChecked, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span className="text-sm font-semibold">{`Switch # ${
            index + 1
          }`}</span>
          <Switch
            onChange={handleChange(index)}
            checked={isChecked}
            offColor="#888"
            onColor="#1F2937"
            uncheckedIcon={false}
            checkedIcon={false}
            height={20}
            width={48}
            handleDiameter={18}
          />
        </div>
      ))}
    </div>
  );
};

export default SwitchExample;
