import React from "react";
import { connect } from "react-redux";
import { searchBibRecord } from "../actions/searching";

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };
    this.handleSearchTyped = this.handleSearchTyped.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  render() {
    const load = this.props.pendingSearch ? (
      <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true" />
    ) : null;
    const { pendingSearch } = this.props;
    return (
      <div className="py-4" style={{ textAlign: "center" }}>
        <div className="input-group margin-bottom-sm">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fa fa-search fa-fw" aria-hidden="true" />
            </span>
          </div>
          <input
            className="form-control"
            placeholder="Indtast bibliographic record ID eller repository ID"
            type="text"
            value={this.state.search}
            onKeyPress={this.onKeyPressed}
            onChange={this.handleSearchTyped}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary search-btn"
              disabled={pendingSearch}
              onClick={this.searchSubmit}
            >
              {load}Søg
            </button>
          </div>
        </div>
      </div>
    );
  }

  onKeyPressed(event) {
    if (event.key === "Enter") this.searchSubmit();
  }

  searchSubmit() {
    this.props.submitSearch(this.state.search);
  }

  handleSearchTyped(event) {
    const { value } = event.target;
    this.setState({
      search: value
    });
  }
}

const mapStateToProps = state => ({
  pendingSearch: state.search.searchPending,
  searchParameter: state.search.searchParameter
});

const mapDispatchToProps = dispatch => ({
  submitSearch: searchTerm => dispatch(searchBibRecord(searchTerm))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchField);
