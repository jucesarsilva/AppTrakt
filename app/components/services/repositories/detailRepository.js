/**
 * @function Repository for #!/detail
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function () {

    'use strict';

    angular
        .module(modules.services)
        .factory('DetailRepository', DetailRepository);

    DetailRepository.$inject = ['$http', '$apiSetting'];

    function DetailRepository($http, $apiSetting) {

        return {
            'getSummary': function __getSummary(id) {
                return $http.get($apiSetting.url_api + '/movies/' + id + '?extended=full');
            },
            'getComments': function __getComments(id) {
                return $http.get($apiSetting.url_api + '/movies/' + id + "/comments/newest?page=1&limit=1000&extended=full");
            },
            'getRatings': function __getRatings(id) {
                return $http.get($apiSetting.url_api + '/movies/' + id + "/ratings?extended=full");
            }
        };
    };

})();