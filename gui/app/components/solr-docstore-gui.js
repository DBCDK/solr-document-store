import React from 'react';
import ListResults  from './list_results';
import DisplayError from './display_error';

class SolrDocstoreGUI extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            search: '',
            pendingSearch: false,
            searchResults: [],
            error: ''
        };
        this.handleSearchTyped = this.handleSearchTyped.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
    }

    render(){
        let load = (this.state.pendingSearch) ? <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"/> : null;
        return (
            <div className="container">
                <div className="py-4" style={{"text-align": "center"}}>
                    <h1 id="h1-div-headline">Søg FAUST nr:</h1>
                    <div className="input-group margin-bottom-sm">
                        <span className="input-group-addon"><i className="fa fa-search fa-fw" aria-hidden="true"/></span>
                        <input
                            className="form-control"
                            placeholder="Indtast faust nr"
                            type="text"
                            value={this.state.search}
                            onChange={this.handleSearchTyped}/>
                    </div>
                    <button
                        className="btn btn-primary btn-lg my-2"
                        disabled={this.state.pendingSearch}
                        onClick={this.searchSubmit}>
                        {load}Søg
                    </button>
                </div>
                <DisplayError
                    displayMessage={this.state.error}/>
                <ListResults
                    loading={this.state.pendingSearch}
                    results={this.state.searchResults}/>
            </div>
        )
    }

    searchSubmit(){
        this.setState({
            pendingSearch: true
        });
        fetch(
            'api/getBibliographicRecord/'+encodeURIComponent(this.state.search)
        ).then((res)=>{
            if(res.status === 200)
                return res.json();
            else
                if(res.status === 400)
                    throw new Error("Input error, server failed to URL decode bibliographicRecordId");
                else
                    throw new Error("Error with http status code: "+res.status);
        }).then((response)=>{
            this.setState({
                pendingSearch: false,
                error: '',
                searchResults: response.result
            })
        }).catch((error)=>{
            this.setState({
                pendingSearch: false,
                error: error.message
            })
        })
    }

    handleSearchTyped(event){
        const { value } = event.target;
        this.setState({
            search: value
        })
    }
}

export default SolrDocstoreGUI;
