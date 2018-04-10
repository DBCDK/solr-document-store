import React from "react";
import SearchField from "./search_field";
import ListResults from "./list_results";
import DisplayError from "./display_error";
import BibliographicExplorer from "./bibliographic_explorer";
import RelatedHoldingsExplorer from "./related_holdings";
import { connect } from "react-redux";
import { initialRetrieveBibItem } from "../actions/searching";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Navbar,
  NavbarBrand,
  Collapse
} from "reactstrap";

const BIBLIOGRAPHIC_EXPLORER = 0;
const RELATED_HOLDINGS_EXPLORER = 1;

class SolrDocstoreGUI extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: BIBLIOGRAPHIC_EXPLORER,
      systemName: ""
    };
    this.activateTabWithKey = this.activateTabWithKey.bind(this);
    this.activateIndexKeyExplorer = this.activateIndexKeyExplorer.bind(this);
    this.activateRelatedHoldingsExplorer = this.activateRelatedHoldingsExplorer.bind(
      this
    );
    this.isActive = this.isActive.bind(this);
  }

  componentDidMount() {
    // Small script to figure out what system we are running on, since this is a
    // pretty simple procedure we skip the whole redux thing
    fetch("/api/status/system")
      .then(res => res.json())
      .then(json => this.setState({ systemName: json.systemName }))
      .catch(e => {});
    // Figuring out af someone is using a link to a specific item
    let params = new URLSearchParams(window.location.search);
    let key = params.get("key");
    if (key) {
      try {
        let bibKey = JSON.parse(key);
        if (bibKey.bibliographicRecordId && bibKey.bibliographicAgencyId) {
          console.log("Let get this show on a roll!");
          this.props.preSelectBibItem(
            bibKey.bibliographicRecordId,
            bibKey.bibliographicAgencyId
          );
        }
      } catch (e) {
        console.log("Invalid key in URL");
      }
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
    return (
      <div>
        <Navbar color="dark" light expand="md">
          <NavbarBrand href="/" className="text-light">
            solr-document-store Søgeværktøj
          </NavbarBrand>
          <Collapse navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/queue-admin.html" className="text-light">
                  Kø administrator
                </NavLink>
              </NavItem>
              <NavItem className="text-light mx-4 my-2">
                {this.state.systemName}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
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
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={this.isActive(BIBLIOGRAPHIC_EXPLORER)}
                      onClick={this.activateIndexKeyExplorer}
                    >
                      Index keys
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={this.isActive(RELATED_HOLDINGS_EXPLORER)}
                      onClick={this.activateRelatedHoldingsExplorer}
                    >
                      Related holdings
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
              <TabContent activeTab={this.state.activeItem}>
                <TabPane tabId={BIBLIOGRAPHIC_EXPLORER}>
                  <BibliographicExplorer />
                </TabPane>
                <TabPane tabId={RELATED_HOLDINGS_EXPLORER}>
                  <RelatedHoldingsExplorer />
                </TabPane>
              </TabContent>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  preSelectBibItem: (bibId, agencyId) =>
    dispatch(initialRetrieveBibItem(bibId, agencyId))
});

export default connect(mapStateToProps, mapDispatchToProps)(SolrDocstoreGUI);
