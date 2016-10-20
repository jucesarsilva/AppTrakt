/**
 * @function main module for services
 * @param
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function __services(){
    
    'use strict';

    angular.module('AppTrakt.services', [])
    
    .constant("ApiTraktSetting", {
        url: "https://trakt.tv",
        api: "https://api.trakt.tv",
        clientID: "53feefa402e36ee5ba6dd1d4897bb1e013e5e02b1e7992873452dada213a8b44",
        secretClient: "4323ccb334c3e0e641c57373c1f9ce4ae36b7050934f07c22923b15a3d281b8c",
        token: null,
        redirectURI: "http://127.0.0.1:8000/",
        cors: ""
    });
    
})();