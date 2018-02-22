import React from "react";

const ManifestationParentElement = ({ name, list }) => {
  return (
    <div className="d-flex bg-light border px-2 py-1 my-2">
      <b style={{ flex: 1 }}>{name}:</b>{" "}
      {list.length > 1 ? list.join(", ") : list[0]}
    </div>
  );
};

export default ManifestationParentElement;
