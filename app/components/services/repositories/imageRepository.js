/**
 * @function Repository for get imagens resources in another APIs
 * @author julio_c.silva@outlook.com
 * @since 10/11/2016
 * @returns
 */
(function () {

    'use strict';

    angular
        .module(modules.services)
        .factory('ImageRepository', ImageRepository);

    ImageRepository.$inject = ['$http'];

    function ImageRepository($http) {
        
        var fanart_tv_url_api = "http://webservice.fanart.tv/v3/movies/";
        var fanart_tv_personal_api_key = "83ad3a02073907b87e5943c4ee17d4bd";
        var fanart_tv_project_api_key = "e719a9e318615f93de12083a57501f47";
        
        return {
            'getImageResource': function __getImageResource(id) {
                return $http
                    .get(fanart_tv_url_api
                         .concat(id)
                         .concat('?api_key=')
                         .concat(fanart_tv_project_api_key));
            }
        };
    };

})();