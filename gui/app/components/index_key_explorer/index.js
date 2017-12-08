import React from 'react';
import Parent from './parent';
import ParentElement from "./parent_element";

const IndexKeyExplorer  = ({item})=>{
    return Object.keys(item).sort().map((key) =>
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
};

export default IndexKeyExplorer;