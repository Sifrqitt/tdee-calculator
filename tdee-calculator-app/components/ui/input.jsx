import React from "react";

export const Input = ({ type, value, onChange, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="border rounded-md p-2 w-full"
      {...props}
    />
  );
};
