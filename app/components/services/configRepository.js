/**
 * @function Repository for auth
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function () {

    'use strict';

    angular
        .module('AppTrakt.services')
        .factory('ConfigRepository', ConfigRepository);

    ConfigRepository.$inject = ['$http', 'ApiTraktSetting'];

    function ConfigRepository($http, ApiTraktSetting) {

        return {
            'getToken': function __getToken(param) {
                return $http.post(ApiTraktSetting.api.concat("/oauth/token"), param);
            }
        };
    };

})();