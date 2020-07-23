import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import { shallow, mount } from "enzyme";

import configureMockStore from "redux-mock-store";

import TOC from "../layout/TOC";

const mockStore = configureMockStore();

describe("TOC Component", () => {
  const component = shallow(<TOC />);

  window.location.pathname = "/section3/3a";

  it("renders", () => {
    expect(component.exists()).toBe(true);
  });

  it("has appropriate classnames", () => {
    expect(component.exists(".toc")).toBe(true);
  });
});

// (TO DELETE) What else should i test for??

// Does the elements in the items array have urls??
// Are all of the urls also present in the router??
