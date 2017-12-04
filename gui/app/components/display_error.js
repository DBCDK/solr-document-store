import React from 'react';
import { connect } from 'react-redux';

class DisplayError extends React.PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        return (this.props.displayMessage.length > 0) ?
            <div className="alert alert-danger" role="alert">{this.props.displayMessage}</div> : null;
    }
}

const mapStateToProps = (state) => ({
    displayMessage: state.search.searchErrorMessage
});

export default connect(mapStateToProps)(DisplayError);