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
    let load = this.props.pendingSearch ? (
      <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true" />
    ) : null;
    return (
      <div className="py-4" style={{ textAlign: "center" }}>
        <h1 id="h1-div-headline">Søg FAUST nr:</h1>
        <div className="input-group margin-bottom-sm">
          <span className="input-group-addon">
            <i className="fa fa-search fa-fw" aria-hidden="true" />
          </span>
          <input
            className="form-control"
            placeholder="Indtast faust nr"
            type="text"
            value={this.state.search}
            onKeyPress={this.onKeyPressed}
            onChange={this.handleSearchTyped}
          />
        </div>
        <button
          className="btn btn-primary btn-lg my-2"
          disabled={this.props.pendingSearch}
          onClick={this.searchSubmit}
        >
          {load}Søg
        </button>
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
  pendingSearch: state.search.searchPending
});

const mapDispatchToProps = dispatch => ({
  submitSearch: searchTerm => dispatch(searchBibRecord(searchTerm))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchField);
