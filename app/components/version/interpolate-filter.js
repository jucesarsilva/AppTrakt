/**
 * @function filtro de versão do AppTrakt
 * @param
 * @returns
 */
(function __interpolate_filter(){
    
    'use strict';

    angular.module('AppTrakt.version.interpolate-filter', [])

    .filter('interpolate', ['version', function(version) {
      return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    }]);
    
})();