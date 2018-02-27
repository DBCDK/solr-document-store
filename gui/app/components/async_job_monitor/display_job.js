import React from "react";
import moment from "moment";
import { requestSubscribe } from "../../actions/async_job";
import { connect } from "react-redux";

const format = "HH:mm:ss - DD/MM";

const DisplayJob = ({
  type,
  uuid,
  runnerUUID,
  name,
  running,
  canceled,
  completed,
  started,
  startedAt,
  completedAt,
  subscribe
}) => {
  let innerProps = running
    ? { onClick: () => subscribe(uuid), style: { cursor: "pointer" } }
    : {};
  return (
    <div className="border-bottom">
      <div {...innerProps}>
        <b>Job:</b> {`${uuid} - ${name}`} <br />
        <b>Begyndte:</b> {`${moment(startedAt).format(format)}`} <br />
        <b>Afbrudt:</b> {`${canceled}`} <br />
        {!running ? (
          <React.Fragment>
            <b>Afsluttet:</b> {moment(completedAt).format(format)}
          </React.Fragment>
        ) : null}
      </div>
      <a
        href={"/api/async-job/log/" + uuid}
        target="_blank"
        style={{ cursor: "pointer" }}
      >
        Fuld log
      </a>
    </div>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  subscribe: uuid => {
    console.log("Soo...");
    dispatch(requestSubscribe(uuid));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DisplayJob);
