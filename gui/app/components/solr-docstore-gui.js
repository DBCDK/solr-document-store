import React from 'react';
import SearchField from './search_field';
import ListResults  from './list_results';
import DisplayError from './display_error';

class SolrDocstoreGUI extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            pendingSearch: false,
            searchResults: [],
        };
    }

    render(){
        return (
            <div className="container">
                <SearchField/>
                <DisplayError/>
                <ListResults/>
            </div>
        )
    }
}

export default SolrDocstoreGUI;
