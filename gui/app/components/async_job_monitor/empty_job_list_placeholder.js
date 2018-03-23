import React from "react";
import { Alert } from "reactstrap";

const EmptyJobListPlaceholder = ({ type }) => {
  return <Alert color="dark">Ingen {type} i øjeblikket</Alert>;
};

export default EmptyJobListPlaceholder;
