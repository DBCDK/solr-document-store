import React from "react";

class SubscriptionItem extends React.Component {
  constructor(props) {
    super(props);
    this.isScrolledToBottom = false;
  }
  render() {
    let { uuid, name, log } = this.props;
    if (this.textLog) {
      this.isScrolledToBottom =
        this.textLog.scrollHeight - this.textLog.clientHeight <=
        this.textLog.scrollTop + 1;
    }
    return (
      <div>
        <h4>
          {name} - {uuid}
        </h4>
        <div
          ref={textLog => (this.textLog = textLog)}
          style={{ width: "48vw", height: "30vh", overflow: "auto" }}
        >
          {(log || []).map((l, i) => (
            <div key={"ll-" + uuid + "-" + i}>{l}</div>
          ))}
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.isScrolledToBottom) {
      this.textLog.scrollTop =
        this.textLog.scrollHeight - this.textLog.clientHeight;
    }
  }
}

export default SubscriptionItem;
