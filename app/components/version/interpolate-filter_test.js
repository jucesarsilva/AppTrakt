/**
 * @function Teste filtro de versão do AppTrakt
 * @param
 * @returns
 */
(function __interpolate_filter_test(){
   
    'use strict';

    describe('AppTrakt.version module', function() {
      beforeEach(module('AppTrakt.version'));

      describe('interpolate filter', function() {
        beforeEach(module(function($provide) {
          $provide.value('version', 'TEST_VER');
        }));

        it('should replace VERSION', inject(function(interpolateFilter) {
          expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
        }));
      });
    });
    
})();
