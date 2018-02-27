import React from "react";
import SubscriptionButton from "./subscription_button";

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
      <div className="border">
        <div className="d-flex">
          <h4 style={{ flex: "1" }}>
            {name} - {uuid}
          </h4>
          <SubscriptionButton uuid={uuid} />
        </div>
        <div
          className="border"
          ref={textLog => (this.textLog = textLog)}
          style={{ height: "30vh", overflow: "auto" }}
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
