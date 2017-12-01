import React from 'react';
import Element from "./element";
import { connect } from 'react-redux';
import { selectWhiteListPending } from '../../actions/filtering';

class Parent extends React.PureComponent {
    constructor(props){
        super(props);
        this.state = {
            expanded: false,
        };
        this.onExpandToggled = this.onExpandToggled.bind(this);
        this.onWhiteList = this.onWhiteList.bind(this);
    }

    render(){
        if(this.props.isWhiteListed){
            let {name,children} = this.props;
            let classNameExpanded = "fa fa-lg px-2 py-2 fa-caret-"+((this.state.expanded) ? "down" : "up");
            const parent = <div key={name} className="bg-light border d-flex">
                <div onClick={this.onExpandToggled} className="mr-auto">
                    <p className="h5 font-weight-bold">{name}</p>
                </div>
                <i className={classNameExpanded} onClick={this.onExpandToggled} aria-hidden="true"/>
                <i className="fa fa-lg fa-minus-square px-2 py-2" onClick={this.onWhiteList} aria-hidden="true"/>
            </div>;
            let childElements = (this.state.expanded) ? Object.keys(children).sort().map((key) =>
                    <Element
                        key={name+key}
                        name={key}
                        parentName={name}
                        list={children[key]}/>
            ) : [];
            return [parent].concat(childElements);
        } else {
            return null
        }
    }

    onExpandToggled(){
        this.setState({
            expanded: !this.state.expanded
        })
    }

    onWhiteList(){
        let {name,children} = this.props;
        var whiteListedItem = {};
        whiteListedItem[name] = {};
        Object.keys(children).forEach((k)=>{
            whiteListedItem[name][k] = true
        });
        this.props.setWhiteListPending(whiteListedItem);
    }
}

const mapStateToProps = (state,ownProps) => ({
    pendingWhiteList: state.filter.whiteListPending[ownProps.name] !== undefined,
    isWhiteListed: state.filter.whiteListedElements === null || state.filter.whiteListedElements[ownProps.name] !== undefined
});

const mapDispatchToProps = (dispatch,ownProps) => ({
    setWhiteListPending: (whiteListedItem) => dispatch(selectWhiteListPending(whiteListedItem))
});

export default connect(mapStateToProps,mapDispatchToProps)(Parent);