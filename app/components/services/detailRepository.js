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
        .factory('MasterRepository', MasterRepository);

    MasterRepository.$inject = ['$http', 'ApiTraktSetting'];

    function MasterRepository($http, ApiTraktSetting) {

        return {
            'getUser': function __getUser() {
                return $http.get(ApiTraktSetting.url + '/Like/GetWhoLiked');
            }
        };
    };

})();