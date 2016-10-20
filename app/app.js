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
        
        ApiTraktSetting.token = {
            access_token: $util.getUrlParams().access_token,
            token_type: $util.getUrlParams().token_type,
            expires_in: $util.getUrlParams().expires_in
        }
       
       // window.localStorage.setItem("ApiTraktSetting", ApiTraktSetting);
        
         if(ApiTraktSetting.code) {
             
             var data = {
                 code: ApiTraktSetting.code,
                 client_id: ApiTraktSetting.clientID,
                 client_secret: ApiTraktSetting.secretClient,
                 redirect_uri: "http://127.0.01:8000/",
                 grant_type: "authorization_code"
             }
             
            ConfigRepository.getToken(data, function(result){
                console.log(result);
            }, function() {
                console.log(result);
            })
         }
        
         var auth_path = ApiTraktSetting.url
         .concat("/oauth/authorize?response_type=token")
         .concat("&client_id=")
         .concat(ApiTraktSetting.clientID)
         .concat("&redirect_uri=")
         .concat(ApiTraktSetting.redirectURI);
        
        console.log(ApiTraktSetting);
        
        if(!ApiTraktSetting.token)
            window.open(auth_path, '_self');
    };
    
    function Config($locationProvider, $routeProvider, $httpProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/master'});
        
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    };
    
})();