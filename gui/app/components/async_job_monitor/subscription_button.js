import React from "react";
import { connect } from "react-redux";
import { requestSubscribe, requestUnsubscribe } from "../../actions/async_job";

const SubscriptionButton = ({ subscribed, subscribe, unsubscribe }) => {
  return (
    <div
      className="pr-2"
      onClick={() => (subscribed ? unsubscribe() : subscribe())}
    >
      {
        <i
          className={`fa fa-volume-${subscribed ? "off" : "up"} fa-2x`}
          aria-hidden="true"
        />
      }
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  subscribed: state.asyncJob.subscriptions.has(ownProps.uuid)
});

const mapDispatchToProps = dispatch => ({
  subscribe: uuid => dispatch(requestSubscribe(uuid)),
  unsubscribe: uuid => dispatch(requestUnsubscribe(uuid))
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  subscribed: stateProps.subscribed,
  subscribe: () => dispatchProps.subscribe(ownProps.uuid),
  unsubscribe: () => dispatchProps.unsubscribe(ownProps.uuid)
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  SubscriptionButton
);
