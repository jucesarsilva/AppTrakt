/**
 * @function Repository for #!/master
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function () {

    'use strict';

    angular
        .module('AppTrakt.services')
        .factory('MasterRepository', MasterRepository);

    MasterRepository.$inject = ['$http', 'ApiTraktSetting'];

    function MasterRepository($http, ApiTraktSetting) {

        return {
            'getMoviesPopular': function __getMoviesPopular(currentPage, pageSize) {
                return $http.get(ApiTraktSetting.api + '/movies/popular?page='+ currentPage + '&limit=' + pageSize);
            },
            'getMoviesTrending': function __getMoviesTrending(currentPage, pageSize) {
                return $http.get(ApiTraktSetting.api + '/movies/trending?page='+ currentPage + '&limit=' + pageSize);
            }
        };
    };

})();