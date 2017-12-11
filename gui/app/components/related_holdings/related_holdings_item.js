import React from 'react';
import Manifestation from "./manifestation";

class RelatedHoldingsItem extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render(){
        let {relatedHoldingItem} = this.props;
        let {
            agencyId,
            producerVersion,
            trackingId,
            commitWithin
        } = relatedHoldingItem;
        return (
            <div className="d-flex flex-column p-4 border">
                <div className="d-flex flex-row text-center font-weight-bold">
                    <div style={{flex: "1"}}>Holdings agency: {agencyId}</div>
                    <div style={{flex: "1"}}>Producer version: {producerVersion}</div>
                    <div style={{flex: "1"}}>tracking id: {trackingId}</div>
                    <div style={{flex: "1"}}>commit within: {commitWithin}</div>
                </div>
                {(relatedHoldingItem.indexKeys || []).map((e,i) =>
                    <Manifestation
                        key={i}
                        item={e}/>
                )}
            </div>
        )
    }
}

export default RelatedHoldingsItem;