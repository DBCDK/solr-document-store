import React from "react";
import ReactTable from "react-table";
import { connect } from "react-redux";
import { selectBibRecord } from "../actions/global";
import { fetchPage,setPageSize } from "../actions/searching";

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
    Header: "Producer Version",
    accessor: "producerVersion"
  },
  {
    Header: "Deleted",
    accessor: "deleted",
    Cell: props => "" + props.value
  },
  {
    Header: "Tracking ID",
    accessor: "trackingId"
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
      setPageSize
    } = this.props;
    return (
      <ReactTable
        loading={loading}
        pages={pages}
        columns={columns}
        data={results}
        getTrProps={(state, rowInfo, column) => {
          return {
            onClick: (e, handleOriginal) => {
              selectItem(results[rowInfo.index]);
              if (handleOriginal) {
                handleOriginal();
              }
            }
          };
        }}
        //sortable={false}
        multiSort={false}
        showPaginagion={true}
        showPageSizeOptions={true}
        pageSizeOptions={[10, 20, 50, 100]}
        defaultPageSize={10}
        manual
        onFetchData={(state,instance) => {
          console.log("Fetch data");
          fetchPage(state.page,state.sorted[0]);
        }}
        onPageSizeChange={(pageSize,pageIndex)=>{
          console.log("Page size change");
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
  pages: state.search.searchPageCount
});

const mapDispatchToProps = dispatch => ({
  selectItem: item => dispatch(selectBibRecord(item)),
  fetchPage: (pageIndex,orderBy) => dispatch(fetchPage(pageIndex,orderBy)),
  setPageSize: pageSize => dispatch(setPageSize(pageSize))
});

export default connect(mapStateToProps, mapDispatchToProps)(ListResults);
