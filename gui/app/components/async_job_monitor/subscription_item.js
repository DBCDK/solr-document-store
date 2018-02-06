import React from "react";

class SubscriptionItem extends React.Component {
  constructor(props) {
    super(props);
    this.isScrolledToBottom = false;
  }
  render() {
    let { uuid, name, log } = this.props;
    let t = this.textLog;
    if (t) {
      let isScrolledToBottom =
        t.scrollHeight - t.clientHeight <= t.scrollTop + 1;
      console.log(t.scrollHeight - t.clientHeight, t.scrollTop + 1);
      if (isScrolledToBottom) {
        this.isScrolledToBottom = true;
      } else {
        this.isScrolledToBottom = false;
      }
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
