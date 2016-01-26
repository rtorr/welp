import React from 'react';
import ReactDOM from 'react-dom';

import {WelpComponent, WelpStore, WelpDispatcher} from './../lib';
const UPDATE_NUMBER = 'UPDATE_NUMBER';

function update_number(value) {
  WelpDispatcher.dispatch({
    type: UPDATE_NUMBER,
    data: value
  });
}

const HelloStore = new WelpStore(
  {hello: {
    count: 0
  }},
  action => {
    switch (action.type) {
      case UPDATE_NUMBER:
        return HelloStore.replace(HelloStore.data().updateIn(['hello', 'count'], _ => action.data));
    }
  }
);

class App extends WelpComponent {
  constructor(props) {
    super(props, [HelloStore]);
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

ReactDOM.render(<App />, document.getElementById('example'));
