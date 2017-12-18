import React from 'react';

const ManifestationHeader = ({expanded, name, toggleExpand}) => {
    let classNameExpanded = "fa fa-lg px-2 py-2 fa-caret-"+((expanded) ? "down" : "up");
    return (
        <div key={name} className="bg-light border d-flex px-2">
            <div onClick={toggleExpand} style={{flex: 1}}>
                <p className="h5 font-weight-bold">{name}</p>
            </div>
            <i className={classNameExpanded} onClick={toggleExpand} aria-hidden="true"/>
        </div>
    )
};

export default ManifestationHeader