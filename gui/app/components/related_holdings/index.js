import React from 'react';
import { connect } from 'react-redux';
import Loading from '../loading';

class RelatedHoldingsExplorer extends React.PureComponent {
    constructor(props){
        super(props);
    }

    render(){
        let {loading,relatedHoldings} = this.props;
        if(loading){
            return (
                <Loading
                    message="Retrieving related holdings"/>
            )
        } else if(this.props.errorMessage.length > 0){
            return (<div className="alert alert-danger">{this.props.errorMessage}</div>)
        } else if(relatedHoldings.length === 0){
            return (<div>Nothing to show here</div>)
        } else {
            return relatedHoldings.map((h,i) => <div key={i}>{JSON.stringify(h)}</div>)
        }
    }
}

const mapStateToProps = (state) => ({
    loading: state.relatedHoldings.loading,
    relatedHoldings: state.relatedHoldings.relatedHoldings,
    errorMessage: state.relatedHoldings.errorMessage
});

export default connect(mapStateToProps)(RelatedHoldingsExplorer);