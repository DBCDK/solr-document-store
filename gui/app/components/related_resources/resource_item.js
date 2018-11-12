import React from "react";

const ResourceItem = ({
  resource_item: { agencyId, bibliographicRecordId, field, value }
}) => {
  return (
    <tr>
      <td>{bibliographicRecordId}</td>
      <td>{agencyId}</td>
      <td>{field}</td>
      <td>{"" + value}</td>
    </tr>
  );
};

export default ResourceItem;
