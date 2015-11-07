import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import LCARS from 'lcars';
import {StoreComponent, ImmutableStore} from './../lib'
const UPDATE_NUMBER = 'UPDATE_NUMBER';

function updae_number(value) {
  LCARS.dispatch({
    type: UPDATE_NUMBER,
    data: value
  });
}

const HelloStore = new ImmutableStore(
  {hello: {
    count: 0
  }},
  action => {
    switch (action.type) {
      case UPDATE_NUMBER:
        return HelloStore.updateIn(['count'], _ => action.data);
    }
  }
);


class App extends StoreComponent {
  constructor(props){
    super(props, [HelloStore])
    this.handleUpdateNumberChange = this.handleUpdateNumberChange.bind(this);
  }
  handleUpdateNumberChange() {
    return updae_number(this.state.hello.count+=1);
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
