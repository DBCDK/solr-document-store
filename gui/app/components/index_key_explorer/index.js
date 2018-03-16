import React from "react";
import Parent from "./parent";

let keySort = (k1, k2) => {
  if (k1 === k2) return 0;
  else if (k1 > k2) return 1;
  else return -1;
};

const IndexKeyExplorer = ({
  item,
  HeaderComponentClass,
  ParentElementComponentClass,
  ElementComponentClass,
  defaultExpansion = false
}) => {
  return Object.keys(item)
    .sort((k1, k2) => {
      let k1IsParentElement = item[k1] instanceof Array;
      let k2IsParentElement = item[k2] instanceof Array;
      if (k1IsParentElement === k2IsParentElement) {
        return keySort(k1, k2);
      } else {
        return k1IsParentElement < k2IsParentElement ? 1 : -1;
      }
    })
    .map(
      key =>
        item[key] instanceof Array ? (
          <ParentElementComponentClass key={key} name={key} list={item[key]} />
        ) : (
          <Parent
            key={key}
            HeaderComponentClass={HeaderComponentClass}
            ElementComponentClass={ElementComponentClass}
            name={key}
            children={item[key]}
            defaultExpansion={defaultExpansion}
          />
        )
    );
};

export default IndexKeyExplorer;
