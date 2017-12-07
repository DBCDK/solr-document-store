import { connect } from 'react-redux';
import {applyFilter, clearFilter} from "../actions/filtering";
import IndexKeyExplorer from './index_key_explorer';

const mapStateToProps = (state) => ({
    item: state.filter.selectedItem
});

const mapDispatchToProps = (dispatch) => ({
    applyFilter: () => dispatch(applyFilter()),
    clearFilter: () => dispatch(clearFilter())
});

export default connect(mapStateToProps,mapDispatchToProps)(IndexKeyExplorer);

