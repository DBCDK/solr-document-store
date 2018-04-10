import React from "react";
import { connect } from "react-redux";
import { searchBibRecord } from "../actions/searching";
import {
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Button
} from "reactstrap";

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
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fa fa-search fa-fw" aria-hidden="true" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Indtast bibliographic record ID eller repository ID"
            type="text"
            value={this.state.search}
            onKeyPress={this.onKeyPressed}
            onChange={this.handleSearchTyped}
          />
          <InputGroupAddon addonType="append">
            <Button
              color="outline-primary"
              className="search-btn"
              disabled={pendingSearch}
              onClick={this.searchSubmit}
            >
              {load}Søg
            </Button>
          </InputGroupAddon>
        </InputGroup>
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
