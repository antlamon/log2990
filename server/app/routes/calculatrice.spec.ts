import {TestClass} from './calculatrice'
import {assert} from 'chai'

describe('ta mere', ( ) => {
   it("test1", ( ) => {
       assert.equal(TestClass.add('ayyy'), 0, 'Na pas fonctionner');
   }) ;
});
