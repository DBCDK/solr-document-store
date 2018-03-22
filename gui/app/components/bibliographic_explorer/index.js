import React from "react";
import { connect } from "react-redux";
import { applyFilter, clearFilter } from "../../actions/filtering";
import IndexKeyExplorer from "../index_key_explorer/index";
import Header from "./header";
import ParentElement from "./parent_element";
import Element from "./element";
import { Button } from "reactstrap";

const BibliographicExplorer = ({ item, applyFilter, clearFilter }) => (
  <div>
    <IndexKeyExplorer
      HeaderComponentClass={Header}
      ParentElementComponentClass={ParentElement}
      ElementComponentClass={Element}
      item={item}
    />
    <div className="d-flex justify-content-center mt-3">
      <Button color="primary" className="mx-2" onClick={applyFilter}>
        Anvend filter
      </Button>
      <Button color="primary" className="mx-2" onClick={clearFilter}>
        Ryd filter
      </Button>
      <abbr title="Marker med fluebenet hvilke felter du udelukkende vil se, og tryk 'Anvend filter' ">
        <i className="fa fa-question-circle mx-2 fa-2x" aria-hidden="true" />
      </abbr>
    </div>
  </div>
);

const mapStateToProps = state => ({
  item: state.filter.selectedItem
});

const mapDispatchToProps = dispatch => ({
  applyFilter: () => dispatch(applyFilter()),
  clearFilter: () => dispatch(clearFilter())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  BibliographicExplorer
);
