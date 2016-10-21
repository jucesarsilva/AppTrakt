/**
 * @function main module
 * @param
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
    
    Run.$inject = ['ApiTraktSetting', '$util', 'ConfigRepository'];
    Config.$inject = ['$locationProvider', '$routeProvider', '$httpProvider'];
    
    function Run(ApiTraktSetting, $util, ConfigRepository) {
        
        ApiTraktSetting.code = $util.getUrlParams().code;
        
        if(ApiTraktSetting.code) {
             
             var data = {
                 code: ApiTraktSetting.code,
                 client_id: ApiTraktSetting.clientID,
                 client_secret: ApiTraktSetting.secretClient,
                 redirect_uri: ApiTraktSetting.redirectURI,
                 grant_type: ApiTraktSetting.grant_type
             }
             
            ConfigRepository.getToken(data, function(result){
                ApiTraktSetting.token = {
                    access_token: result.data.access_token,
                    token_type: result.data.token_type,
                    expires_in: result.data.expires_in
                };
            }, function() {
                console.log(result);
            });
         }

        var auth_path = ApiTraktSetting.url
        .concat("/oauth/authorize?response_type=code")
        .concat("&client_id=")
        .concat(ApiTraktSetting.clientID)
        .concat("&redirect_uri=")
        .concat(ApiTraktSetting.redirectURI);
        
        if(!ApiTraktSetting.code)
            window.open(auth_path, '_self');
    };
    
    function Config($locationProvider, $routeProvider, $httpProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/master'});
        
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    };
    
})();