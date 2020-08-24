import React, { Component } from "react";
import { connect } from "react-redux";
import PageInfo from "../../layout/PageInfo";
import FormNavigation from "../../layout/FormNavigation";
import FormActions from "../../layout/FormActions";
import { Tabs, TabPanel } from "@cmsgov/design-system-core";
import FillForm from "../../layout/FillForm";
import QuestionsBasicInfo from "./questions/QuestionsBasicInfo";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const validTelephoneRegex = RegExp(
  /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
);

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fillFormTitle: "Same as last year",
    };
  }

  render() {
    return (
      <div className="section-basic-info ds-l-col--9 content">
        <div className="main">
          <PageInfo />
          <div className="section-content">
            <Tabs>
              <TabPanel id="tab-form" tab="Basic Information">
                <QuestionsBasicInfo previousYear="false" />
                <FormNavigation nextUrl="/section1" />
              </TabPanel>

              <TabPanel
                id="tab-lastyear"
                tab={`FY${this.props.year - 1} answers`}
              >
                <div disabled>
                  <QuestionsBasicInfo previousYear="true" />
                </div>
              </TabPanel>
            </Tabs>
            <FormActions />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  abbr: state.stateUser.currentUser.state.id,
  year: state.stateUser.formYear,
  programType: state.stateUser.programType,
  programName: state.stateUser.programName,
});

export default connect(mapStateToProps)(BasicInfo);
