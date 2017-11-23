import React from 'react';

class DisplayError extends React.PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        return (this.props.displayMessage.length > 0) ?
            <div className="alert alert-danger" role="alert">{this.props.displayMessage}</div> : null;
    }
}

export default DisplayError;