import React from 'react';
import Parent from './parent';
import ParentElement from "./parent_element";

const IndexKeyExplorer  = ({item,applyFilter,clearFilter})=>{
    let elems = Object.keys(item).sort().map((key) =>
        (item[key] instanceof Array) ?
            <ParentElement
                key={key}
                name={key}
                list={item[key]}/> :
            <Parent
                key={key}
                name={key}
                children={item[key]}/>
    );
    return (
        <div>
            {elems}
            <div className="d-flex justify-content-center">
                <button
                    className="btn btn-primary mx-2 my-4"
                    onClick={applyFilter}>
                    Apply filter
                </button>
                <button
                    className="btn btn-primary mx-2 my-4"
                    onClick={clearFilter}>
                    Clear filters
                </button>
            </div>
        </div>
    );
};

export default IndexKeyExplorer;