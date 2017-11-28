import React from 'react';
import ReactTable from 'react-table';
// Webpack will bundle the included styling
import 'react-table/react-table.css';

const columns = [{
    Header: 'agencyId',
    accessor: 'agencyId'
},{
    Header: 'bibliographicRecordId',
    accessor: 'bibliographicRecordId'
},{
    Header: 'Producer Version',
    accessor: 'producerVersion'
},{
    Header: 'Deleted',
    accessor: 'deleted',
    Cell: (props)=>""+props.value
},{
    Header: 'Tracking ID',
    accessor: 'trackingId'
}];

class ListResults extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <ReactTable
                loading={this.props.loading}
                columns={columns}
                data={this.props.results}
                showPaginagion={true}
                showPageSizeOptions={true}
                pageSizeOptions={[20, 50, 100, 200]}
                defaultPageSize={20}/>
        )
    }
}

export default ListResults;