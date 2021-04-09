import React from "react";
import ReactTable from "react-table";
import { connect } from "react-redux";
import { selectBibRecord } from "../actions/global";
import { fetchPage, setPageSize } from "../actions/searching";

// Webpack will bundle the included styling
import "react-table/react-table.css";

const columns = [
  {
    Header: "Agency",
    accessor: "agencyId"
  },
  {
    Header: "Record Id",
    accessor: "bibliographicRecordId"
  },
  {
    Header: "Deleted",
    accessor: "deleted",
    Cell: props => "" + props.value
  },
  {
    Header: "Supersede ID",
    accessor: "supersedeId"
  }
];

class ListResults extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      loading,
      results,
      pages,
      selectItem,
      fetchPage,
      setPageSize,
      selectedBib,
      selectedAgency
    } = this.props;
    return (
      <ReactTable
        loading={loading}
        pages={pages}
        columns={columns}
        data={results}
        getTrProps={(state, rowInfo, column) => {
          let props = {
            onClick: (e, handleOriginal) => {
              selectItem(results[rowInfo.index]);
              if (handleOriginal) {
                handleOriginal();
              }
            }
          };
          // If current row is selected, works because props for this component is changed whenever something is selected
          if (
            rowInfo &&
            rowInfo.original.bibliographicRecordId === selectedBib &&
            rowInfo.original.agencyId === selectedAgency
          )
            props.style = { background: "#d9d9d9" };
          return props;
        }}
        //sortable={false}
        multiSort={false}
        showPaginagion={true}
        showPageSizeOptions={true}
        pageSizeOptions={[10, 20, 50, 100]}
        defaultPageSize={10}
        manual
        onFetchData={(state, instance) => {
          fetchPage(state.page, state.sorted[0]);
        }}
        onPageSizeChange={(pageSize, pageIndex) => {
          setPageSize(pageSize);
          fetchPage(pageIndex);
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  loading: state.search.searchPending,
  results: state.search.searchResults,
  pages: state.search.searchPageCount,
  selectedBib: state.global.selectedBibRecordId,
  selectedAgency: state.global.selectedBibAgencyId
});

const mapDispatchToProps = dispatch => ({
  selectItem: item => dispatch(selectBibRecord(item)),
  fetchPage: (pageIndex, orderBy) => dispatch(fetchPage(pageIndex, orderBy)),
  setPageSize: pageSize => dispatch(setPageSize(pageSize))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListResults);
