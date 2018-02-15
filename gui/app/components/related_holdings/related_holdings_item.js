import React from "react";
import Manifestation from "./manifestation";

class RelatedHoldingsItem extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let { relatedHoldingItem } = this.props;
    let {
      agencyId
      //producerVersion,
      //trackingId,
      //commitWithin
    } = relatedHoldingItem;
    return (
      <div className="d-flex flex-column p-4 border">
        <div className="d-flex flex-row text-center font-weight-bold">
          <div className="h5 font-weight-bold">Holdings agency: {agencyId}</div>
        </div>
        {(relatedHoldingItem.indexKeys || [])
          .sort((e1, e2) => {
            let status1 = e1["holdingsitem.status"][0];
            let status2 = e2["holdingsitem.status"][0];
            if (status1 < status2) return -1;
            if (status1 > status2) return 1;
            return 0;
          })
          .map((e, i) => <Manifestation key={i} item={e} />)}
      </div>
    );
  }
  /*
    <div style={{ flex: "1" }}>Producer version: {producerVersion}</div>
    <div style={{ flex: "1" }}>tracking id: {trackingId}</div>
    <div style={{ flex: "1" }}>commit within: {commitWithin}</div>
  */
}

export default RelatedHoldingsItem;
