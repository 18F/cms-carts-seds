import React, { Component } from "react";
import { connect } from "react-redux";
import { TextField } from "@cmsgov/design-system-core";
import PropTypes from "prop-types";
import uuid from "react-uuid";

// This method checks that month input is appropriate
// (not empty, max of 2 digits, no letters, between 1 & 12)
const validateMonth = (input) => {
  let returnString;

  // Handles an empty input field
  if (input === "") {
    returnString = "Month field cannot be empty";
  }

  // Prevents users from putting in more than 2 characters
  if (input.length > 2) {
    returnString = "Month length must not exceed 2";
  }

  // Checks for non-numeric characters
  if (Number.isNaN(parseInt(input, 10)) || /^\d+$/.test(input) === false) {
    returnString = "Please enter a number";
  }

  if (parseInt(input, 10) < 1 || parseInt(input, 10) > 12) {
    // Checks that the month value is within a normal range
    returnString = "Please enter a valid month number";
  }
  return returnString;
};

class DateRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endRangeErr: false,
      monthStart: "",
      yearStart: "",
      monthEnd: "",
      yearEnd: "",
      startErrorMessage: [],
      endErrorMessage: [],
    };
    this.handleInput = this.handleInput.bind(this);

    this.checkChronology = this.checkChronology.bind(this);

    this.validateStartInput = this.validateStartInput.bind(this);
    this.validateEndInput = this.validateEndInput.bind(this);

    this.validateYear = this.validateYear.bind(this);
  }

  componentDidMount() {
    // Stored value example: ['2019-11-01', '2020-09-01']
    const { question } = this.props;
    const storedValue = question.answer.entry;

    if (storedValue) {
      // Returns an array with the values of the start date, split
      const startDate = storedValue[0].split("-"); // ie: ['2019', '11', '01']

      // Returns an array with the values of the start date, split
      const endDate = storedValue[1].split("-"); // ie: ['2020', '09', '01']

      const monthStartValue = startDate[1]; // '11'
      const yearStartValue = startDate[0]; // '2019'

      const monthEndValue = endDate[1]; // '09'
      const yearEndValue = endDate[0]; // '2020'

      this.setState({
        monthStart: monthStartValue || "",
        monthEnd: monthEndValue || "",
        yearStart: yearStartValue || "",
        yearEnd: yearEndValue || "",
      });
    } else {
      this.setState({
        monthStart: "",
        monthEnd: "",
        yearStart: "",
        yearEnd: "",
      });
    }
  }

  // This method checks all 4 fields to confirm that the start range is before the end range
  checkChronology() {
    const {
      monthStart,
      monthEnd,
      yearStart,
      yearEnd,
      startErrorMessage,
      endErrorMessage,
    } = this.state;
    const errorCheck = [...startErrorMessage, ...endErrorMessage];
    const { onChange, question } = this.props;
    let chronologyError;

    // Ensure that all 4 fields are filled in
    if (monthStart && monthEnd && yearStart && yearEnd) {
      // Turn the input into date objects for easy comparison
      const startDate = new Date(yearStart, monthStart - 1);
      const endDate = new Date(yearEnd, monthEnd - 1);

      // The entry value for daterange must be sent to the server as an array of two strings
      // The format must be an ISO 8601 Date format.
      // Because we are only asking for month/year, the last digit is a placeholder of '01'
      const payload = [
        `${yearStart}-${monthStart}-01`,
        `${yearEnd}-${monthEnd}-01`,
      ];

      if (startDate > endDate) {
        chronologyError = true;
      } else {
        chronologyError = false;
        if (errorCheck.some((element) => element !== undefined)) {
          // console.log("ONNNN", "\n", "CHANGE", "\n", "TRIGGERED");
          // console.log(errorCheck);
          onChange([question.id, payload]); // Chronology is correct, no errors present, send data to redux
        }
        // check state for any errors at all
        // 1: Join arrays and check for anything with length?
        // 2: Join arrays and check for anything that is not undefined?
      }

      this.setState({
        endRangeErr: chronologyError,
      });
    }
  }

  // This method checks that year input is appropriate
  // (not empty, max of 4 digits, no letters, reasonable year)
  validateYear(input) {
    const { year } = this.props;

    let returnString;
    // Handles an empty input field
    if (input === "") {
      returnString = "Year field cannot be empty";
    }

    // Prevents users from putting in more than 2 characters
    if (input.length > 4) {
      // failing = true;
      returnString = "Year length must not exceed 4";
    }

    if (
      // Checks for non-numeric characters
      Number.isNaN(parseInt(input, 10)) ||
      /^\d+$/.test(input) === false
    ) {
      // failing = true;
      returnString = "Please enter a number";
    } else if (
      parseInt(input, 10) < 1776 ||
      parseInt(input, 10) > parseInt(year, 10)
    ) {
      // Checks that the month value is within a normal range
      returnString = "Please enter a valid Year";
    }
    return returnString;
  }

  // This method checks the first month/year input range and sets any validation errors to state
  validateStartInput() {
    const startErrorArray = [];

    const { monthStart, yearStart } = this.state;

    startErrorArray.push(validateMonth(monthStart));
    startErrorArray.push(this.validateYear(yearStart));

    this.setState({
      startErrorMessage: startErrorArray,
    });

    this.checkChronology();
  }

  // This method checks the second month/year input range and sets any validation errors to state
  validateEndInput() {
    const endErrorArray = [];

    const { monthEnd, yearEnd } = this.state;

    endErrorArray.push(validateMonth(monthEnd));
    endErrorArray.push(this.validateYear(yearEnd));

    this.setState({
      endErrorMessage: endErrorArray,
    });

    this.checkChronology();
  }

  // This method takes all user input and sets it to state
  handleInput(evt) {
    this.setState({
      [evt.target.name]: evt.target.value ? evt.target.value : "",
    });
  }

  render() {
    const { question } = this.props;
    const {
      startErrorMessage,
      endErrorMessage,
      endRangeErr,
      monthStart,
      monthEnd,
      yearStart,
      yearEnd,
    } = this.state;

    return (
      <div className="date-range" data-test="component-date-range">
        <div className="date-range-start">
          <h3 className="question-inner-header">
            {question.answer.labels[0] ? question.answer.labels[0] : "Start"}
          </h3>
          <div className="ds-c-field__hint"> mm/yyyy</div>
          <div className="errors">
            {startErrorMessage.map((e) => {
              if (e !== undefined) {
                return <div key={uuid()}> {e} </div>;
              }
              return false;
            })}
          </div>
          <div className="date-range-start-wrapper">
            <TextField
              className="ds-c-field--small"
              data-test="component-daterange-monthstart"
              name="monthStart"
              numeric
              label=""
              onChange={this.handleInput}
              onBlur={this.validateStartInput}
              value={monthStart}
            />
            <div className="ds-c-datefield__separator">/</div>
            <TextField
              className="ds-c-field--small"
              name="yearStart"
              label=""
              onChange={this.handleInput}
              onBlur={this.validateStartInput}
              numeric
              value={yearStart}
            />
          </div>
        </div>

        <div className="date-range-start">
          <h3 className="question-inner-header">
            {" "}
            {question.answer.labels[1] ? question.answer.labels[1] : "End"}{" "}
          </h3>
          <div className="ds-c-field__hint"> mm/yyyy</div>
          <div className="errors">
            {endErrorMessage.map((e) => {
              if (e !== undefined) {
                return <div key={uuid()}> {e} </div>;
              }
              return false;
            })}
          </div>

          <div className="date-range-end-wrapper">
            <TextField
              className="ds-c-field--small"
              name="monthEnd"
              numeric
              label=""
              onChange={this.handleInput}
              onBlur={this.validateEndInput}
              value={monthEnd}
            />
            <div className="ds-c-datefield__separator">/</div>

            <TextField
              className="ds-c-field--small"
              name="yearEnd"
              label=""
              onChange={this.handleInput}
              onBlur={this.validateEndInput}
              numeric
              value={yearEnd}
            />
          </div>
          <div className="errors">
            {endRangeErr === true ? (
              <div> End date must come after start date</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

DateRange.propTypes = {
  question: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  year: PropTypes.string,
};

DateRange.defaultProps = {
  year: new Date().getFullYear().toString(), // Returns the current year as a default
};

const mapStateToProps = (state) => ({
  year: state.global.formYear,
});

export default connect(mapStateToProps)(DateRange);
