import React from "react";

export const Button = ({ children, variant = "default", onClick, ...props }) => {
  const baseClass = "px-4 py-2 rounded-md font-medium";
  const variantClass =
    variant === "default"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50";
  return (
    <button onClick={onClick} className={`${baseClass} ${variantClass}`} {...props}>
      {children}
    </button>
  );
};
