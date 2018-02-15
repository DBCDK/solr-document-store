import React from "react";
import { connect } from "react-redux";
import { selectWhiteListPending } from "../../actions/filtering";

const onWhiteList = (setWhiteListPending, name, children) => () => {
  let whiteListedItem = {};
  whiteListedItem[name] = {};
  Object.keys(children).forEach(k => {
    whiteListedItem[name][k] = true;
  });
  setWhiteListPending(whiteListedItem);
};

const Header = ({
  expanded,
  name,
  toggleExpand,
  children,
  isWhiteListed,
  setWhiteListPending
}) => {
  if (isWhiteListed) {
    let classNameExpanded =
      "fa fa-lg px-2 py-2 expand-button-header fa-caret-" +
      (expanded ? "down" : "up");
    let whiteList = onWhiteList(setWhiteListPending, name, children);
    return (
      <div key={name} className="bg-light border d-flex">
        <div onClick={toggleExpand} style={{ flex: 1 }}>
          <p className="h5 font-weight-bold">{name}</p>
        </div>
        <i
          className={classNameExpanded}
          onClick={toggleExpand}
          aria-hidden="true"
        />
        <i
          className="fa fa-lg fa-minus-square px-2 py-2 whitelist-button-header"
          onClick={whiteList}
          aria-hidden="true"
        />
      </div>
    );
  } else {
    return null;
  }
};

// If webapp becomes slow, use reselect (https://github.com/reactjs/reselect) to essentially cache
// the computed values below, making them less expensive on re-renders
const mapStateToProps = (state, ownProps) => ({
  pendingWhiteList: state.filter.whiteListPending[ownProps.name] !== undefined,
  isWhiteListed:
    state.filter.whiteListedElements === null ||
    state.filter.whiteListedElements[ownProps.name] !== undefined
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setWhiteListPending: whiteListedItem =>
    dispatch(selectWhiteListPending(whiteListedItem))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
