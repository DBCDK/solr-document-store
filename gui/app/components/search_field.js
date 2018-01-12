import React from "react";
import { connect } from "react-redux";
import {searchBibRecord, selectSearchParameter} from "../actions/searching";
import {SEARCH_BIB_ID, SEARCH_REPO_ID} from "../api";

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };
    this.handleSearchTyped = this.handleSearchTyped.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.selectSearchBibId = this.selectSearchBibId.bind(this);
    this.selectSearchRepoId = this.selectSearchRepoId.bind(this);
  }

  render() {
    const load = this.props.pendingSearch ? (
      <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true" />
    ) : null;
    const {
      pendingSearch,
      searchParameter
    } = this.props;
    return (
      <div className="py-4" style={{ textAlign: "center" }}>
        <h1 id="h1-div-headline">Solr-document-store Søgeværktøj</h1>
        <div className="input-group margin-bottom-sm">
          <span className="input-group-addon">
            <i className="fa fa-search fa-fw" aria-hidden="true" />
          </span>
          <input
            className="form-control"
            placeholder="Indtast søge parameter"
            type="text"
            value={this.state.search}
            onKeyPress={this.onKeyPressed}
            onChange={this.handleSearchTyped}
          />
        </div>
        <div className="btn-group px-4" role="group" aria-label="Search parameter options">
          <button
              type="button"
              className={"btn btn-secondary"+((searchParameter === SEARCH_BIB_ID) ? " active" : "")}
              onClick={this.selectSearchBibId}
          >
            bibliographic record ID
          </button>
          <button
              type="button"
              className={"btn btn-secondary"+((searchParameter === SEARCH_REPO_ID) ? " active" : "")}
              onClick={this.selectSearchRepoId}
          >
            repository ID
          </button>
        </div>
        <button
          className="btn btn-primary btn-lg my-2"
          disabled={pendingSearch}
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

  selectSearchRepoId(event){
    this.props.selectParameter(SEARCH_REPO_ID)
  }

  selectSearchBibId(event){
    this.props.selectParameter(SEARCH_BIB_ID)
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
  submitSearch: searchTerm => dispatch(searchBibRecord(searchTerm)),
  selectParameter: parameter => dispatch(selectSearchParameter(parameter))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchField);
