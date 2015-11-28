import React from 'react';
import ReactDOM from 'react-dom';
import LCARS from 'lcars';
import expect from 'expect';
import {WelpComponent, WelpStore} from './../';
import Immutable from 'immutable';
import ReactTestUtils from 'react-addons-test-utils';

const UPDATE_NUMBER = 'UPDATE_NUMBER';

function update_number(value) {
  LCARS.dispatch({
    type: UPDATE_NUMBER,
    data: value
  });
}

const Store = new WelpStore(
  {hello: {
    count: 0
  }},
  action => {
    switch (action.type) {
      case UPDATE_NUMBER:
        return Store.updateIn(['hello', 'count'], _ => action.data);
    }
  }
);

class App extends WelpComponent {
  constructor(props) {
    super(props, [Store]);
    this.handleUpdateNumberChange = this.handleUpdateNumberChange.bind(this);
  }
  handleUpdateNumberChange() {
    return update_number(this.state.hello.count + 1);
  }
  render() {
    return (
      <div>
        <p>Hello world! {this.state.hello.count}</p>
        <button onClick={this.handleUpdateNumberChange}>Add + 1</button>
      </div>
    );
  }
}

describe('WelpComponent', () => {
  describe('Check initail state', () => {
    it('We should have initail data from the store', () => {
      const component = ReactTestUtils.renderIntoDocument(<App />);
      expect(component.state.hello.count).toEqual(0);
    });
  });
  describe('Update state', () => {
    it('We should have initail data from the store', () => {
      const component = ReactTestUtils.renderIntoDocument(<App />);
      expect(component.state.hello.count).toEqual(0);
      update_number(1);
      expect(component.state.hello.count).toEqual(1);
    });
  });
  describe('Hot Loading', () => {
    it('Check for mounted', () => {
      const component = ReactTestUtils.renderIntoDocument(<App />);
      expect(component.mounted).toEqual(true);
    });
  });
});
