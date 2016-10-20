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

    $HttpInterceptor.$inject = ['$q'];
    Config.$inject = ['$httpProvider', '$locationProvider', '$provide'];

     /**
     * @function Config
     * @params
     * @returns
     */
    function $HttpInterceptor($q, $HttpTransform) {

        var _service = {
            request: function (config) {
                
                try {
                    //config.headers["Access-Control-Allow-Origin"] = "*";
                    //config.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";
                    //config.headers["Access-Control-Allow-Headers"] = "Content-Type, Access-Control-Allow-Headers, X-Requested-With, trakt-api-key, trakt-api-version";
                    
                    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
                    config.headers["Trakt-Api-Key"] = "f0b54aad3fd33efbcf12d70218dae129fdf59e1374b653321d0dc5fcd393c546";
                    config.headers["Trakt-Api-Version"] = "2";
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

         return _service;
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