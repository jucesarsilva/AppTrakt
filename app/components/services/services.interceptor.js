/**
 * @function main module for services
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function () {

    'use strict';

    angular
        .module('AppTrakt.services')
        .factory('$HttpInterceptor', $HttpInterceptor)
        .config(Config);

    $HttpInterceptor.$inject = ['$q', "ApiTraktSetting"];
    Config.$inject = ['$httpProvider', '$locationProvider', '$provide'];

     /**
     * @function Config
     * @params
     * @returns
     */
    function $HttpInterceptor($q, ApiTraktSetting) {

        var factory = {
            request: function (config) {
                
                try {
                    config.headers["Content-Type"] = "application/json";
                    config.headers["Trakt-Api-Key"] = ApiTraktSetting.clientID;
                    config.headers["Trakt-Api-Version"] = ApiTraktSetting.apiVersion;
                } 
                catch(e) {
                }
                return config || $q.when(config);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (request) {
                
                return $q.reject(request);
            }
         };

         return factory;
    };

    /**
     * @function Config
     * @params
     * @returns
     */
    function Config($httpProvider, $locationProvider, $provide) {
        $locationProvider.html5Mode(false);
        $httpProvider.interceptors.push('$HttpInterceptor');
    };

})();