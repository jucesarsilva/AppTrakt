/**
 * @function main module
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function __AppTrakt(){
    
    'use strict';
    
    angular.module(modules.main, ['ngRoute',
      modules.master,
      modules.detail,
      modules.version,
      modules.directives,
      modules.filters,
      modules.services
    ])
    .config(Config)
    .run(Run)
    
    Run.$inject = ['$apiSetting', '$util'];
    Config.$inject = ['$locationProvider', '$routeProvider', '$httpProvider'];
    
    function Run($apiSetting, $util) {
        $apiSetting.code = $util.getUrlParams().code;
        if(!$apiSetting.code) window.open($apiSetting.url_get_code, '_self');
    };
    
    function Config($locationProvider, $routeProvider, $httpProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/master'});
    };
    
})();