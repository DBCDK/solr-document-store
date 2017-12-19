import React from "react";

class Parent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.onExpandToggled = this.onExpandToggled.bind(this);
  }

  render() {
    let {
      name,
      children,
      HeaderComponentClass,
      ElementComponentClass
    } = this.props;
    const parent = (
      <HeaderComponentClass
        key={name}
        expanded={this.state.expanded}
        children={children}
        toggleExpand={this.onExpandToggled}
        name={name}
      />
    );
    let childElements = this.state.expanded
      ? Object.keys(children)
          .sort()
          .map(key => (
            <ElementComponentClass
              key={name + key}
              name={key}
              parentName={name}
              list={children[key]}
            />
          ))
      : [];
    return [parent].concat(childElements);
  }

  onExpandToggled() {
    this.setState({
      expanded: !this.state.expanded
    });
  }
}

export default Parent;
