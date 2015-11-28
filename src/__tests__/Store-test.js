import LCARS from 'lcars';
import expect from 'expect';
import {ImmutableStore} from './../';
import Immutable from 'immutable';

describe('ImmutableStore', () => {

  const factory = (type) => {
    try {
      return new ImmutableStore(type, action => action);  
    } catch (error) {
      return error;
    }
    return 'goodtogo';
  };

  describe('Validate initial data', () => {

    it('cannot be anything but an object or array', () => {
      expect(factory(12).message).toBe('Base Store: The first argument must be an object or array');
      expect(factory('12').message).toBe('Base Store: The first argument must be an object or array');
      expect(factory(undefined).message).toBe('Base Store: The first argument must be an object or array');
      expect(factory(null).message).toBe('Base Store: The first argument must be an object or array');
      expect(factory(x=>x).message).toBe('Base Store: The first argument must be an object or array');
      expect(factory().message).toBe('Base Store: The first argument must be an object or array');
    });

    it('must be an Object or Array', () => {
      expect( factory({}) instanceof ImmutableStore ).toBe(true);
      expect( factory([]) instanceof ImmutableStore ).toBe(true);
    });
    
  });

  describe('Create a new ImmutableStore', () => {
    it('data passed to a new store is immutable', () => {
      const s = new ImmutableStore(
        {test: 'test'},
        action => action
      );
      const test_data = s.get('test');
      s.set('test', 'new_test_data');
      expect(test_data).toEqual('test');
      expect(test_data).toNotEqual(s.get('test'));
    });
  });


  describe('Update data from dispatched actions', () => {
    it('set', () => {
      const TEST_TWO = 'TEST_TWO';
      const s = new ImmutableStore(
        {test: 'test'},
        action => {
          switch (action.type) {
            case TEST_TWO:
              return s.set('test', action.data);
          }
        }
      );
      LCARS.dispatch({
        type: TEST_TWO,
        data: 'http://www.rtorr.com/'
      });
      expect(s.get('test')).toEqual('http://www.rtorr.com/');
    });
  });

  describe('Store methods', () => {
    it('set', () => {
      const s = new ImmutableStore(
        {test: 'test'},
        action => action
      );
      s.set('test', 'bob');
      expect('bob').toEqual(s.get('test'));
    });
    it('get', () => {
      const s = new ImmutableStore(
        {test: 'test'},
        action => action
      );
      expect(s.get('test')).toEqual('test');
    });
    it('getStateData - returns javascript (for react state)', () => {
      const s = new ImmutableStore(
        {test: 'test'},
        action => action
      );
      expect(s.getStateData()).toEqual({test: 'test'});
    });
    it('updateIn', () => {
      const s = new ImmutableStore(
        {test: {
          wat: 'wat'
        }},
        action => action
      );
      s.updateIn(['test', 'wat'], _ => 'wot');
      expect('wot').toEqual(s.get('test').toJS().wat);
    });
    it('getDataStructure - returns an immutable js map of our data', () => {
      const s = new ImmutableStore(
        {test: 'test'},
        action => action
      );
      expect(Immutable.Map({test: 'test'})).toEqual(s.getDataStructure());
    });
  });

});
