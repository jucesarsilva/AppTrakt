/**
 * @function Repository for #!/master
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function () {

    'use strict';

    angular
        .module(modules.services)
        .factory('MasterRepository', MasterRepository);

    MasterRepository.$inject = ['$http', '$apiSetting'];

    function MasterRepository($http, $apiSetting) {

        return {
            'getMoviesPopular': function __getMoviesPopular(currentPage, pageSize) {
                return $http.get($apiSetting.url_api + '/movies/popular?page='+ currentPage + '&limit=' + pageSize);
            },
            'getMoviesTrending': function __getMoviesTrending(currentPage, pageSize) {
                return $http.get($apiSetting.url_api + '/movies/trending?page='+ currentPage + '&limit=' + pageSize);
            }
        };
    };

})();