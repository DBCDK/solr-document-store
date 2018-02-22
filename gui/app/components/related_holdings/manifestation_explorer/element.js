import React from "react";

const ManifestiationElement = ({ name, parentName, list }) => {
  return (
    <div className="d-flex border border-bottom px-2 py-1">
      <b style={{ flex: 1 }}>{name}:</b>{" "}
      {list.length > 1 ? list.join(", ") : list[0]}
    </div>
  );
};

export default ManifestiationElement;
