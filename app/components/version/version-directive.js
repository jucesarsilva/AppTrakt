/**
 * @function Directiva para Versão do AppTrakt
 * @param
 * @returns
 */
(function __version_directive(){
    
    'use strict';

    angular.module('AppTrakt.version.version-directive', [])

    .directive('appVersion', ['version', function(version) {
      return function(scope, elm, attrs) {
        elm.text(version);
      };
    }]);
    
})();
