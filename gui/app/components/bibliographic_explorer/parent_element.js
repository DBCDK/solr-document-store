import React from "react";

const ParentElement = ({ name, list }) => {
  return (
    <p className="border rounded h6 py-2">
      <strong>{name}</strong> : {list}
    </p>
  );
};

export default ParentElement;
