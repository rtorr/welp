import { Dispatcher } from 'flux';
import objectAssign from 'object-assign';
import queue from 'queue';

var _action_queue = queue({
  concurrency: 1
});

var WelpDispatcher = new Dispatcher();

objectAssign(WelpDispatcher, {
  _dispatch: WelpDispatcher.dispatch,

  /**
   * @param {object} action
   */
  dispatch: function(action) {

    _action_queue.push(function(cb) {
      this._dispatch(action);
      cb();
    }.bind(this));

    _action_queue.start();

  }
});

export default WelpDispatcher;
