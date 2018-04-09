import React from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";

class DisplayError extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.displayMessage.length > 0 ? (
      <Alert color="danger">{this.props.displayMessage}</Alert>
    ) : null;
  }
}

const mapStateToProps = state => ({
  displayMessage: state.search.searchErrorMessage
});

export default connect(mapStateToProps)(DisplayError);
