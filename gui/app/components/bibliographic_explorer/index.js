import React from 'react';
import { connect } from 'react-redux';
import {applyFilter, clearFilter} from "../../actions/filtering";
import IndexKeyExplorer from '../index_key_explorer/index';
import Header from "./header";
import ParentElement from './parent_element';
import Element from './element';

const BibliographicExplorer = ({item,applyFilter,clearFilter}) => (
    <div>
        <IndexKeyExplorer
            HeaderComponentClass={Header}
            ParentElementComponentClass={ParentElement}
            ElementComponentClass={Element}
            item={item}/>
        <div className="d-flex justify-content-center">
            <button
                className="btn btn-primary mx-2 my-4"
                onClick={applyFilter}>
                Apply filter
            </button>
            <button
                className="btn btn-primary mx-2 my-4"
                onClick={clearFilter}>
                Clear filters
            </button>
        </div>
    </div>
)

const mapStateToProps = (state) => ({
    item: state.filter.selectedItem
});

const mapDispatchToProps = (dispatch) => ({
    applyFilter: () => dispatch(applyFilter()),
    clearFilter: () => dispatch(clearFilter())
});

export default connect(mapStateToProps,mapDispatchToProps)(BibliographicExplorer);

