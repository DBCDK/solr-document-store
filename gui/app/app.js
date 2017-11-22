import React from 'react';

class App extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            search: ''
        };
        this.handleSearchTyped = this.handleSearchTyped.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
    }

    render(){
        return (
            <div>
                <h1>Søg FAUST nr:</h1>
                <span>
                    <input
                        type="text"
                        value={this.state.search}
                        onChange={this.handleSearchTyped}/>
                    <button className="btn" onClick={this.searchSubmit}>Søg</button>
                </span>
            </div>
        )
    }

    searchSubmit(){
        // TODO submit search query
    }

    handleSearchTyped(event){
        const { value } = event.target;
        this.setState({
            search: value
        })
    }
}

export default App;
