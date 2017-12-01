import React from 'react';
import SearchField from './search_field';
import ListResults  from './list_results';
import DisplayError from './display_error';
import IndexKeyExplorer from './index_key_explorer';

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
            <div className="container-full">
                <div className="row">
                    <div className="col-6">
                        <div style={{"top": "1px","position": "sticky"}}>
                            <SearchField/>
                            <DisplayError/>
                            <ListResults/>
                        </div>
                    </div>
                    <div className="col-6">
                        <IndexKeyExplorer/>
                    </div>
                </div>
            </div>
        )
    }
}

export default SolrDocstoreGUI;
