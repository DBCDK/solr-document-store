import React from "react";
import { connect } from "react-redux";
import Loading from "../loading";
import RelatedHoldingsItem from "./related_holdings_item";
import { Alert } from "reactstrap";

class RelatedHoldingsExplorer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let { loading, relatedHoldings } = this.props;
    if (loading) {
      return <Loading message="Retrieving related holdings" />;
    } else if (this.props.errorMessage.length > 0) {
      return <Alert color="danger">{this.props.errorMessage}</Alert>;
    } else if (relatedHoldings.length === 0) {
      return <div>Nothing to show here</div>;
    } else {
      return relatedHoldings.map((h, i) => (
        <RelatedHoldingsItem
          key={relatedHoldings[i].bibliographicRecordId + "" + i}
          relatedHoldingItem={relatedHoldings[i]}
        />
      ));
    }
  }
}

const mapStateToProps = state => ({
  loading: state.relatedHoldings.loading,
  relatedHoldings: state.relatedHoldings.relatedHoldings,
  errorMessage: state.relatedHoldings.errorMessage
});

export default connect(mapStateToProps)(RelatedHoldingsExplorer);
