/**
 * @function Versão do AppTrakt
 * @param
 * @returns
 */
(function __version(){
    
    'use strict';

    angular.module(modules.version, [
      'AppTrakt.version.interpolate-filter',
      'AppTrakt.version.version-directive'
    ])

    .value('version', '0.1');

})();