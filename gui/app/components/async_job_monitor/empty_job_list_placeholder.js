import React from "react";

const EmptyJobListPlaceholder = ({ type }) => {
  return <div className="alert alert-dark">Ingen {type} i øjeblikket</div>;
};

export default EmptyJobListPlaceholder;
