import React from 'react';

class ListResults extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render(){
        let results = this.props.results;
        let body = (results.length > 0) ? results.map((result) =>
            <tr>
                <td>{result.agencyId}</td>
                <td>{result.bibliographicRecordId}</td>
                <td>{result.producerVersion}</td>
                <td>{""+result.deleted}</td>
                <td>{result.trackingId}</td>
            </tr>
        ) : <p>No results...</p>;
        return (
            <table className="table">
                <thead className="thead-dark">
                    <th scope="col">agencyId</th>
                    <th scope="col">bibliographicRecordId</th>
                    <th scope="col">Producer Version</th>
                    <th scope="col">deleted</th>
                    <th scope="col">trackingId</th>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        )
    }
}

export default ListResults;