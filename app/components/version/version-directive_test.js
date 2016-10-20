/**
 * @function Teste para directiva de Versão do AppTrakt
 * @param
 * @returns
 */
(function __version_directive_test(){
    
    'use strict';

    describe('AppTrakt.version module', function() {
      beforeEach(module('AppTrakt.version'));

      describe('app-version directive', function() {
        it('should print current version', function() {
          module(function($provide) {
            $provide.value('version', 'TEST_VER');
          });
          inject(function($compile, $rootScope) {
            var element = $compile('<span app-version></span>')($rootScope);
            expect(element.text()).toEqual('TEST_VER');
          });
        });
      });
    });
    
})();
