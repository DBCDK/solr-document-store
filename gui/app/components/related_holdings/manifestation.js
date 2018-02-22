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
      expanded: false
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
      "fa fa-lg px-3 py-2 fa-caret-" + (this.state.expanded ? "down" : "up");
    return (
      <div className="border">
        <div
          className="d-flex border pl-3"
          style={{ background: "#d9d9d9" }}
          onClick={() => this.setState({ expanded: !this.state.expanded })}
        >
          <div style={{ flex: 1 }}>
            <div>
              <p>
                <b>Item IDs:</b> {itemId.join(", ")}
              </p>
            </div>
            <div>
              <p>
                <b>Status:</b> {status}
              </p>
            </div>
          </div>
          <i
            className={classNameExpanded}
            onClick={this.onExpandToggled}
            aria-hidden="true"
          />
        </div>
        {this.state.expanded ? (
          <div className="px-4">
            <IndexKeyExplorer
              HeaderComponentClass={ManifestationHeader}
              ParentElementComponentClass={ManifestationParentElement}
              ElementComponentClass={ManifestationElement}
              item={converter(item)}
              defaultExpansion={true}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Manifestation;
