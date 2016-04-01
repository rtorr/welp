# Welp ![Build status](https://circleci.com/gh/rtorr/welp.svg?style=shield&circle-token=:2d24fea4f59a17f8760f93ffe38598ac3ed162e6) [![Coverage Status](https://coveralls.io/repos/rtorr/welp/badge.svg?branch=master&service=github)](https://coveralls.io/github/rtorr/welp?branch=master)

small and simple immutable flux

### Installation

To install the stable version:

```
npm install --save welp
```


## Docs

***`WelpStore (object: {key: value}, callback_function: action)`***

`WelpStore` takes two arguments. First is a javascript object that will be turned into an 
[Immutable Map](http://facebook.github.io/immutable-js/docs/#/Map). 

`WelpStore's` second argument is a callback function that has dispatched action objects passed to it

```
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
```

***`WelpComponent`***

WelpComponent is a base class for a React component that will implement Welp's Immutable store.
I think by reading the small source, you can kind of see what it is up to. 

pass `props` and and an array of `[stores]` to super.

`WelpComponent` will bind to all of the stores passed in that array. When data changes in the stores,
`WelpComponent` will make a comparison of the previous state and previous props to see if there were changes,
if so, we will re-render (look at `shouldComponentUpdate` in `WelpComponent`).

```
class App extends WelpComponent {
  constructor(props){
    super(props, [HelloStore])
    this.handleUpdateNumberChange = this.handleUpdateNumberChange.bind(this);
  }
  handleUpdateNumberChange() {
    return update_number(this.state.hello.count+1);
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
```


### Examples

```
git clone git@github.com:rtorr/welp.git

cd welp

npm run examples
 
open http://localhost:8181/examples/index.html
```
