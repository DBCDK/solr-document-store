import React from "react";
import SearchField from "./search_field";
import ListResults from "./list_results";
import DisplayError from "./display_error";
import BibliographicExplorer from "./bibliographic_explorer";
import RelatedHoldingsExplorer from "./related_holdings";

const BIBLIOGRAPHIC_EXPLORER = 0;
const RELATED_HOLDINGS_EXPLORER = 1;

class SolrDocstoreGUI extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: BIBLIOGRAPHIC_EXPLORER
    };
    this.activeTabComponent = this.activeTabComponent.bind(this);
    this.activateTabWithKey = this.activateTabWithKey.bind(this);
    this.activateIndexKeyExplorer = this.activateIndexKeyExplorer.bind(this);
    this.activateRelatedHoldingsExplorer = this.activateRelatedHoldingsExplorer.bind(
      this
    );
    this.isActive = this.isActive.bind(this);
  }

  activeTabComponent() {
    switch (this.state.activeItem) {
      case BIBLIOGRAPHIC_EXPLORER:
        return BibliographicExplorer;
      case RELATED_HOLDINGS_EXPLORER:
        return RelatedHoldingsExplorer;
      default:
        return BibliographicExplorer;
    }
  }

  activateTabWithKey(key) {
    this.setState({
      activeItem: key
    });
  }

  activateIndexKeyExplorer() {
    this.activateTabWithKey(BIBLIOGRAPHIC_EXPLORER);
  }

  activateRelatedHoldingsExplorer() {
    this.activateTabWithKey(RELATED_HOLDINGS_EXPLORER);
  }

  isActive(key) {
    return this.state.activeItem === key ? "active" : "";
  }

  render() {
    let ActiveTab = this.activeTabComponent();
    return (
      <div className="container-full p-5">
        <div className="row">
          <div className="col-6">
            <div style={{ top: "1px", position: "sticky" }}>
              <SearchField />
              <DisplayError />
              <ListResults />
            </div>
          </div>
          <div className="col-6">
            <div className="py-4">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a
                    className={
                      "nav-link " + this.isActive(BIBLIOGRAPHIC_EXPLORER)
                    }
                    href="#"
                    onClick={this.activateIndexKeyExplorer}
                  >
                    Index keys
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={
                      "nav-link " + this.isActive(RELATED_HOLDINGS_EXPLORER)
                    }
                    href="#"
                    onClick={this.activateRelatedHoldingsExplorer}
                  >
                    Related holdings
                  </a>
                </li>
              </ul>
            </div>
            <ActiveTab />
          </div>
        </div>
      </div>
    );
  }
}

export default SolrDocstoreGUI;
