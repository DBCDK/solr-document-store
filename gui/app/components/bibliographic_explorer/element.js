import React from "react";
import { connect } from "react-redux";
import { selectWhiteListPending } from "../../actions/filtering";

const whiteListElement = (name, parentName, whiteListPending) => {
  let whiteListElement = {};
  whiteListElement[parentName] = {};
  whiteListElement[parentName][name] = !whiteListPending;
  return whiteListElement;
};

class Element extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listExpanded: false
    };
    this.toggleListExpanded = this.toggleListExpanded.bind(this);
  }

  render() {
    let {
      name,
      parentName,
      list,
      whiteListPending,
      setWhiteListPending,
      isWhiteListed
    } = this.props;
    if (isWhiteListed) {
      let classNameWhiteListed =
        "fa fa-lg py-2 pr-4 fa-" + (whiteListPending ? "times" : "check");
      let firstElem = list[0];
      let moreElems =
        list.length > 1 ? (
          <i
            className={
              "fa fa-lg py-2 pr-2 expand-button-element fa-" +
              (this.state.listExpanded ? "compress" : "expand")
            }
            onClick={this.toggleListExpanded}
            aria-hidden="true"
          />
        ) : null;
      return (
        <div>
          <div className="pl-4 d-flex">
            <div className="mr-auto">
              <strong>{name}</strong> : {firstElem}
            </div>
            {moreElems}
            <i
              className={classNameWhiteListed}
              onClick={() =>
                setWhiteListPending(
                  whiteListElement(name, parentName, whiteListPending)
                )
              }
              aria-hidden="true"
            />
          </div>
          {this.state.listExpanded
            ? list.map((e, i) => (
                <p key={name + i} className="pl-5">
                  {e}
                </p>
              ))
            : null}
        </div>
      );
    } else {
      return null;
    }
  }

  toggleListExpanded() {
    this.setState({
      listExpanded: !this.state.listExpanded
    });
  }
}

// If webapp becomes slow, use reselect (https://github.com/reactjs/reselect) to essentially cache
// the computed values below, making them less expensive on re-renders
const mapStateToProps = (state, ownProps) => ({
  whiteListPending:
    state.filter.whiteListPending !== undefined &&
    state.filter.whiteListPending[ownProps.parentName] !== undefined &&
    state.filter.whiteListPending[ownProps.parentName][ownProps.name] === true,
  isWhiteListed:
    state.filter.whiteListedElements === null ||
    (state.filter.whiteListedElements[ownProps.parentName] !== undefined &&
      state.filter.whiteListedElements[ownProps.parentName][ownProps.name] ===
        true)
});

const mapDispatchToProps = dispatch => ({
  setWhiteListPending: whiteListItem =>
    dispatch(selectWhiteListPending(whiteListItem))
});

export default connect(mapStateToProps, mapDispatchToProps)(Element);
