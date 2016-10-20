/**
 * @function Testar Versão do AppTrakt
 * @param
 * @returns
 */
(function __version_test(){
    
    'use strict';

    describe('AppTrakt.version module', function() {
      beforeEach(module('AppTrakt.version'));

      describe('version service', function() {
        it('should return current version', inject(function(version) {
          expect(version).toEqual('0.1');
        }));
      });
    });
})();