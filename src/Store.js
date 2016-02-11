import { fromJS, Iterable, is } from 'immutable';
import EventEmitter from 'eventemitter3';

import Dispatcher from './Dispatcher';

const CHANGE_EVENT = 'CHANGE_EVENT';

class WelpStore extends EventEmitter {

  constructor(store_data, callback) {
    super();
    this._data = this.replaceClean(store_data);
    this.dispatchToken = Dispatcher.register((action) => {
      callback(action);
    });
  }
  _check_data(current, next) {
    if (!is(current, next)) {
      this._data = next;
      this.emit(CHANGE_EVENT);
    }
    return this._data;
  }
  _ensure_immutibility(data) {
    return Iterable.isIterable(data) ? data : fromJS(data);
  }
  replace(data) {
    return this._check_data(this.data(), this._ensure_immutibility(data));
  }
  data() {
    return this._data;
  }
  get(key) {
    return this._data.get(key);
  }
  getStateData() {
    return this._data.toJS();
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
  replaceClean(data) {
    this._clean_state = this._ensure_immutibility(data);
    return this._check_data(this.data(), this._clean_state);
  }
  isDirty() {
    return !is(this._clean_state, this._data);
  }
  isClean() {
    return is(this._clean_state, this._data);
  }
  rollback() {
    return this.replace(this._clean_state);
  }
}

export default WelpStore;
