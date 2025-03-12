import React from "react";

export const Select = ({ value, onValueChange, children }) => {
  // Extract <SelectItem> children from <SelectContent>
  let options = [];
  React.Children.forEach(children, (child) => {
    if (child.type.displayName === "SelectTrigger") {
      // Ignore the trigger
    } else if (child.type.displayName === "SelectContent") {
      React.Children.forEach(child.props.children, (option) => {
        if (option.type.displayName === "SelectItem") {
          options.push(option);
        }
      });
    }
  });

  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded-md p-2 w-full"
    >
      {options.map((option) => (
        <option key={option.props.value} value={option.props.value}>
          {option.props.children}
        </option>
      ))}
    </select>
  );
};

export const SelectTrigger = ({ children }) => {
  return <>{children}</>;
};
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = ({ placeholder }) => {
  return <>{placeholder}</>;
};

export const SelectContent = ({ children }) => {
  return <>{children}</>;
};
SelectContent.displayName = "SelectContent";

export const SelectItem = ({ value, children }) => {
  return <>{children}</>;
};
SelectItem.displayName = "SelectItem";
