import React from "react";

const ResourceItem = ({
  resource_item: { agencyId, bibliographicRecordId, field, value }
}) => {
  return (
    <div>
      {agencyId + ":" + bibliographicRecordId + ":" + field + ":" + value}
    </div>
  );
};

export default ResourceItem;
