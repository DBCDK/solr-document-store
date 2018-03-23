import React from "react";
import EmptyJobListPlaceholder from "./empty_job_list_placeholder";
import DisplayJob from "./display_job";
import { connect } from "react-redux";
import moment from "moment";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import {
  sortByStartedFinishedJobs,
  sortByEarliestFinishedJobs
} from "../../actions/async_job";

const sorter = (sortByStarted, sortByEarliest) => (j1, j2) => {
  let jobDate1 = moment(sortByStarted ? j1.job.startedAt : j1.job.completedAt);
  let jobDate2 = moment(sortByStarted ? j2.job.startedAt : j2.job.completedAt);
  return sortByEarliest
    ? jobDate1 > jobDate2 ? 1 : jobDate1 < jobDate2 ? -1 : 0
    : jobDate1 < jobDate2 ? 1 : jobDate1 > jobDate2 ? -1 : 0;
};

class FinishedJobsPresenter extends React.Component {
  constructor(props) {
    super(props);

    this.toggleStart = this.toggleStart.bind(this);
    this.toggleEarliest = this.toggleEarliest.bind(this);
    this.state = {
      dropdownStartedOpen: false,
      dropdownEarliestOpen: false
    };
  }

  toggleStart() {
    this.setState({
      dropdownStartedOpen: !this.state.dropdownStartedOpen
    });
  }

  toggleEarliest() {
    this.setState({
      dropdownEarliestOpen: !this.state.dropdownEarliestOpen
    });
  }

  render() {
    let {
      jobs,
      sortByStarted,
      sortByEarliest,
      toggleSortByStarted,
      toggleSortByEarliest
    } = this.props;
    return jobs.length > 0 ? (
      [
        <div className="d-flex" key="fin-jobs-header">
          <h2 style={{ flex: "1" }}>Afsluttede Jobs</h2>
          <Dropdown
            className="px-2"
            isOpen={this.state.dropdownStartedOpen}
            toggle={this.toggleStart}
          >
            <DropdownToggle caret>
              Sorter efter: {sortByStarted ? "Start" : "Sluttet"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                active={sortByStarted}
                onClick={() => toggleSortByStarted(true)}
              >
                Start
              </DropdownItem>
              <DropdownItem
                active={!sortByStarted}
                onClick={() => toggleSortByStarted(false)}
              >
                Slut
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown
            className="px-2"
            isOpen={this.state.dropdownEarliestOpen}
            toggle={this.toggleEarliest}
          >
            <DropdownToggle caret>
              Sorter efter: {sortByEarliest ? "Tidligste" : "Seneste"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                active={sortByEarliest}
                onClick={() => toggleSortByEarliest(true)}
              >
                Tidligste
              </DropdownItem>
              <DropdownItem
                active={!sortByEarliest}
                onClick={() => toggleSortByEarliest(false)}
              >
                Seneste
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>,
        ...jobs
          .sort(sorter(sortByStarted, sortByEarliest))
          .map(j => (
            <DisplayJob uuid={j.uuid} {...j.job} key={`fin-job-${j.uuid}`} />
          ))
      ]
    ) : (
      <EmptyJobListPlaceholder key="empty-jobs" type="afsluttede jobs" />
    );
  }
}

const mapStateToProps = state => ({
  sortByStarted: state.asyncJob.sortByStarted,
  sortByEarliest: state.asyncJob.sortByEarliest
});

const mapDispatchToProps = dispatch => ({
  toggleSortByStarted: by => dispatch(sortByStartedFinishedJobs(by)),
  toggleSortByEarliest: by => dispatch(sortByEarliestFinishedJobs(by))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  FinishedJobsPresenter
);
