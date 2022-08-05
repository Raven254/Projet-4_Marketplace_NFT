import React from "react";

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
        {options.map((option, index) => (
          <option value={index}>{option.name}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
