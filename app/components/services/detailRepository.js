/**
 * @function Repository for #!/detail
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function () {

    'use strict';

    angular
        .module('AppTrakt.services')
        .factory('DetailRepository', DetailRepository);

    DetailRepository.$inject = ['$http', 'ApiTraktSetting'];

    function DetailRepository($http, ApiTraktSetting) {

        return {
            'getSummary': function __getSummary(id) {
                return $http.get(ApiTraktSetting.api + '/movies/' + id + '?extended=full');
            },
            'getComments': function __getComments(id) {
                return $http.get(ApiTraktSetting.api + '/movies/' + id + "/comments/newest?page=1&limit=1000&extended=full");
            },
            'getRatings': function __getRatings(id) {
                return $http.get(ApiTraktSetting.api + '/movies/' + id + "/ratings?extended=full");
            }
        };
    };

})();