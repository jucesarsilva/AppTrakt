/**
 * @function main module
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function __AppTrakt(){
    
    'use strict';

    angular.module('AppTrakt', [
      'ngRoute',
      'AppTrakt.master',
      'AppTrakt.detail',
      'AppTrakt.version',
      'AppTrakt.directives',
      'AppTrakt.filters',
      'AppTrakt.services',
    ])
    .config(Config)
    .run(Run)
    
    Run.$inject = ['$apiSetting', '$util', 'ConfigRepository'];
    Config.$inject = ['$locationProvider', '$routeProvider', '$httpProvider'];
    
    function Run($apiSetting, $util, ConfigRepository) {
        
        $apiSetting.code = $util.getUrlParams().code;
        
        if(!$apiSetting.code)
            window.open($apiSetting.url_get_code, '_self');
    };
    
    function Config($locationProvider, $routeProvider, $httpProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/master'});
    };
    
})();