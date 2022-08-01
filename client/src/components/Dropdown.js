import React from "react";
import { MdSocialDistance } from "react-icons/md";

const Dropdown = ({ label, value, options, onChange }) => {
  return (
    <div style={{ fontSize: "3em", textAlign: "center", paddingBottom: 15 }}>
      <label style={{ paddingRight: 10 }}>{label}</label>
      <select
        style={{
          width: 200,
          height: 35,
          borderRadius: 10,
          border: "2px solid",
        }}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
