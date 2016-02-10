import WelpDispatcher from './../Dispatcher';
import expect from 'expect';
import WelpStore from './../Store';
import Immutable from 'immutable';

describe('WelpStore', () => {

  const factory = (type) => {
    try {
      return new WelpStore(type, action => action);
    } catch (error) {
      return error;
    }
  };

  describe('Validate initial data', () => {

    it('must be an Object or Array', () => {
      expect( factory({}) instanceof WelpStore ).toBe(true);
    });

  });

  describe('Create a new WelpStore', () => {
    it('data passed to a new store is immutable', () => {
      const s = new WelpStore(
        {test: 'test'},
        action => action
      );
      const test_data = s.get('test');
      s.replace(s.data().set('test', 'new_test_data'));
      expect(test_data).toEqual('test');
      expect(test_data).toNotEqual(s.get('test'));
    });
  });

  describe('Update data from dispatched actions', () => {
    it('set', () => {
      const TEST_TWO = 'TEST_TWO';
      const s = new WelpStore(
        {test: 'test'},
        action => {
          switch (action.type) {
            case TEST_TWO:
              return s.replace(s.data().set('test', action.data));
          }
        }
      );
      WelpDispatcher.dispatch({
        type: TEST_TWO,
        data: 'http://www.rtorr.com/'
      });
      expect(s.get('test')).toEqual('http://www.rtorr.com/');
    });
  });

  describe('Store method examples', () => {
    it('set', () => {
      const s = new WelpStore(
        {test: 'test'},
        action => action
      );
      s.replace(s.data().set('test', 'bob'));
      expect('bob').toEqual(s.get('test'));
    });
    it('get', () => {
      const s = new WelpStore(
        {test: 'test'},
        action => action
      );
      expect(s.get('test')).toEqual('test');
    });
    it('getStateData - returns javascript (for react state)', () => {
      const s = new WelpStore(
        {test: 'test'},
        action => action
      );
      expect(s.getStateData()).toEqual({test: 'test'});
    });
    it('updateIn', () => {
      const s = new WelpStore(
        {test: {
          wat: 'wat'
        }},
        action => action
      );
      s.replace(s.data().updateIn(['test', 'wat'], _ => 'wot'));
      expect('wot').toEqual(s.get('test').toJS().wat);
    });
    it('getDataStructure - returns an immutable js map of our data', () => {
      const s = new WelpStore(
        {test: 'test'},
        action => action
      );
      expect(Immutable.Map({test: 'test'})).toEqual(s.getDataStructure());
    });
    it('delete', () => {
      const s = new WelpStore(
        {test: 'test'},
        action => action
      );
      expect(s.replace(s.data().delete('test')).toJS()).toEqual({});
    });
    it('clear', () => {
      const s = new WelpStore(
        {test: 'test'},
        action => action
      );
      expect(s.replace(s.data().clear()).toJS()).toEqual({});
    });
    it('merge', () => {
      const s = new WelpStore(
        {test: 'test'},
        action => action
      );
      expect(s.replace(s.data().merge(Immutable.Map({wat: 'wat'}))).toJS()).toEqual({ test: 'test', wat: 'wat' });
    });
    it('becameClean', () => {
      const s = new WelpStore(
        {test: 123},
        action => action
      );
      expect( s._clean_state.toJS() ).toEqual( {test: 123} );
      s.replace(s.data().set('test', 'passed'));
      s.becameClean();
      expect( s._clean_state.toJS() ).toEqual( {test: 'passed'} );
    });
    it('isClean', () => {
      const s = new WelpStore(
        {test: 123},
        action => action
      );
      expect( s.isClean() ).toEqual( true );
      s.replace(s.data().set('test', 'passed'));
      expect( s.isClean() ).toEqual( false );
    });
    it('rollback', () => {
      const s = new WelpStore(
        {test: 123},
        action => action
      );
      expect( s.data().toJS() ).toEqual( {test: 123} );
      s.replace(s.data().set('test', 'somethingelse'));
      expect( s.data().toJS() ).toEqual( {test: 'somethingelse'} );
      s.rollback();
      expect( s.data().toJS() ).toEqual( {test: 123} );
    });
    
  });
});
