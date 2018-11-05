import React from "react";
import { connect } from "react-redux";
import Loading from "../loading";
import ResourceItem from "./resource_item";
import { Alert } from "reactstrap";

const RelatedResourcesExplorer = ({ resources, errorMessage, loading }) => {
  if (loading) {
    return <Loading message="Retrieving related holdings" />;
  } else if (errorMessage.length > 0) {
    return <Alert color="danger">{errorMessage}</Alert>;
  } else if (resources.length === 0) {
    return <div>Nothing to show here</div>;
  } else {
    return resources.map((r, i) => (
      <ResourceItem
        key={resources[i].bibliographicRecordId + "" + i}
        resource_item={resources[i]}
      />
    ));
  }
};

const mapStateToProps = state => ({
  loading: state.relatedResources.loading,
  resources: state.relatedResources.resources,
  errorMessage: state.relatedResources.errorMessage
});

export default connect(mapStateToProps)(RelatedResourcesExplorer);
