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
        
        var fanart_tv_url_api = "http://webservice.fanart.tv/v3/movies/";
        var fanart_tv_personal_api_key = "83ad3a02073907b87e5943c4ee17d4bd";
        var fanart_tv_project_api_key = "e719a9e318615f93de12083a57501f47 - AppTrak";
        
        return {
            'getSummary': function __getSummary(id) {
                return $http.get($apiSetting.url_api + '/movies/' + id + '?extended=full');
            },
            'getComments': function __getComments(id) {
                return $http.get($apiSetting.url_api + '/movies/' + id + "/comments/newest?page=1&limit=1000&extended=full");
            },
            'getRatings': function __getRatings(id) {
                return $http.get($apiSetting.url_api + '/movies/' + id + "/ratings?extended=full");
            },
            'getImageResource': function __getImageResource(id) {
                
                return $http.get(fanart_tv_url_api
                                 .concat(id)
                                 .concat('?api_key=')
                                 .concat(fanart_tv_personal_api_key));
            }
        };
    };

})();