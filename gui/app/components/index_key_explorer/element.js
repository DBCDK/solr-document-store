import React from 'react';
import { connect } from 'react-redux';
import { selectWhiteListPending } from '../../actions/filtering';

const whiteListElement = (name,parentName,whiteListPending) => {
    var whiteListElement = {};
    whiteListElement[parentName] = {};
    whiteListElement[parentName][name] = !whiteListPending;
    return whiteListElement;
};

const Element = ({name,parentName,list,whiteListPending,setWhiteListPending,isWhiteListed}) => {
    if(isWhiteListed){
        let classNameWhiteListed = "fa fa-lg py-2 pr-4 fa-"+((whiteListPending) ? "times" : "check");
        let firstElem = list[0];
        return (
            <div className="pl-4 d-flex">
                <div className="mr-auto">
                    <p><strong>{name}</strong> : {firstElem}</p>
                </div>
                <i className={classNameWhiteListed} onClick={()=>setWhiteListPending(whiteListElement(name,parentName,whiteListPending))} aria-hidden="true"/>
            </div>
        )
    } else {
        return null;
    }
};

const mapStateToProps = (state,ownProps) => ({
    whiteListPending: state.filter.whiteListPending !== undefined &&
        state.filter.whiteListPending[ownProps.parentName] !== undefined &&
        state.filter.whiteListPending[ownProps.parentName][ownProps.name] === true,
    isWhiteListed: state.filter.whiteListedElements === null ||
        (state.filter.whiteListedElements[ownProps.parentName] !== undefined &&
        state.filter.whiteListedElements[ownProps.parentName][ownProps.name] === true)
});

const mapDispatchToProps = (dispatch) => ({
    setWhiteListPending: (whiteListItem) => dispatch(selectWhiteListPending(whiteListItem))
});

export default connect(mapStateToProps,mapDispatchToProps)(Element);