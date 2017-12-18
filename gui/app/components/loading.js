import React from 'react';

class Loading extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="text-center py-4">
                <i className="fa fa-refresh fa-spin fa-fw fa-3x" aria-hidden="true"/>
                <p className="font-weight-bold">{this.props.message}</p>
            </div>
        )
    }
}

export default Loading;