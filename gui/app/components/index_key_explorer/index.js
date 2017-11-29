import React from 'react';
import { connect } from 'react-redux';

class IndexKeyExplorer extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>{JSON.stringify(this.props.item)}</div>
        )
    }
}

const mapStateToProps = (state) => ({
    item: state.filter.selectedItem
});

export default connect(mapStateToProps)(IndexKeyExplorer);