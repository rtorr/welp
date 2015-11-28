import LCARS from 'lcars';
import Immutable from 'immutable';
import {EventEmitter} from 'events';
import {Component} from 'react';
const CHANGE_EVENT = 'change';


class WelpComponent extends Component {

  constructor(props, stores) {
    super(props);
    this.stores = stores;
    this.handleStoresChanged = this.handleStoresChanged.bind(this);
    this.getStateFromStores = this.getStateFromStores.bind(this);
    this.state = this.getStateFromStores();
  }

  componentDidMount() {
    this.mounted = true;
    if (!this.stores) {
      throw new Error('You must have a stores array property');
    }
    if (!this.getStateFromStores) {
      throw new Error('You must implement this.getStateFromStores');
    }
    this.stores.forEach(store => {
      store.addChangeListener(this.handleStoresChanged);
    }, this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props, nextProps) || !Immutable.is(this.state, nextState);
  }

  componentWillUnmount() {
    this.mounted = false;
    this.stores.forEach(store => {
      store.removeChangeListener(this.handleStoresChanged);
    }, this);
  }

  getStateFromStores() {
    if (this.stores.length > 1) {
      return this.stores.reduce((a, b) => a.getDataStructure().merge(b.getDataStructure())).toJS();
    }
    return this.stores[0].getDataStructure().toJS();
  }

  handleStoresChanged() {
    if (this.mounted) {
      return this.setState(this.getStateFromStores());
    }
  }

}

class WelpStore extends EventEmitter {
  constructor(store_data, callback) {
    super()
    if (process.env.NODE_ENV !== 'production') {
      const store_data_type = Object.prototype.toString.call(store_data);
      if (store_data_type !== '[object Object]' && store_data_type !== '[object Array]') {
        throw new Error('Base Store: The first argument must be an object or array');
      }
      if (typeof callback !== 'function') {
        throw new Error('Base Store: The second argument must be a function');
      }
    }
    this._data = Immutable.fromJS(store_data);
    this.dispatchToken = LCARS.register((action) => {
      callback(action);
    });
  }
  get(key) {
    return this._data.get(key);
  }
  getStateData() {
    return this._data.toJS();
  }
  set(key, value) {
    const current = this._data;
    const next = this._data.set(key, value);
    if (current !== next) {
      this._data = next;
      this.emit(CHANGE_EVENT);
    }
    return this._data;
  }
  updateIn(key_path, value) {
    const current = this._data;
    const next = this._data.updateIn(key_path, value);
    if (current !== next) {
      this._data = next;
      this.emit(CHANGE_EVENT);
    }
    return this._data;
  }
  getDataStructure() {
    return this._data;
  }
  emitChange() {
    this.emit(CHANGE_EVENT);
  }
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

export {
  WelpComponent,
  WelpStore
};
