import React from "react";
import converter from "../../functions/index_key_converter";
import IndexKeyExplorer from "../index_key_explorer";
import ManifestationHeader from "./manifestation_explorer/header";
import ManifestationParentElement from "./manifestation_explorer/parent_element";
import ManifestationElement from "./manifestation_explorer/element";

class Manifestation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    };
  }

  render() {
    let { item } = this.props;
    let displayItem = converter(item);
    displayItem.holdingsitem = displayItem.holdingsitem
      ? displayItem.holdingsitem
      : {};
    let { itemId, status } = displayItem.holdingsitem;
    let classNameExpanded =
      "fa fa-lg px-2 py-2 fa-caret-" + (this.state.expanded ? "down" : "up");
    return (
      <div>
        <div
          className="d-flex justify-content-around bg-light border"
          onClick={() => this.setState({ expanded: !this.state.expanded })}
        >
          <p>
            <b>Item ID:</b> {itemId}
          </p>
          <p>
            <b>Status:</b> {status}
          </p>
          <i
            className={classNameExpanded}
            onClick={this.onExpandToggled}
            aria-hidden="true"
          />
        </div>
        {this.state.expanded ? (
          <div className="p-4">
            <IndexKeyExplorer
              HeaderComponentClass={ManifestationHeader}
              ParentElementComponentClass={ManifestationParentElement}
              ElementComponentClass={ManifestationElement}
              item={converter(item)}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Manifestation;
