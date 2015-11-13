# Welp

A small base component and base store for immutable flux

### Installation

To install the stable version:

```
npm install --save welp react react-dom immutable lcars
```


## Docs

***`ImmutableStore (object: {key: value}, callback_function: action)`***

`ImmutableStore` takes two arguments. First is a javascript object that will be turned into an 
[Immutable Map](http://facebook.github.io/immutable-js/docs/#/Map). 

`ImmutableStore's` second argument is a callback function that has dispatched action objects passed to it

```
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
```

***`StoreComponent`***

StoreComponent is a base class for a React component that will implement Welp's Immutable store.
I think by reading the small source, you can kind of see what it is up to. 

pass `props` and and an array of `[stores]` to super.

`StoreComponent` will bind to all of the stores passed in that array. When data changes in the stores,
`StoreComponent` will make a comparison of the previous state and previous props to see if there were changes,
if so, we will re-render (look at `shouldComponentUpdate` in `StoreComponent`).

```
class App extends StoreComponent {
  constructor(props){
    super(props, [HelloStore])
    this.handleUpdateNumberChange = this.handleUpdateNumberChange.bind(this);
  }
  handleUpdateNumberChange() {
    return update_number(this.state.hello.count+=1);
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

npm install

npm build
 
npm start
 
open http://localhost:8181/examples/index.html
```