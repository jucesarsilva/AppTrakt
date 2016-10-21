/**
 * @function controller for Master
 * @param
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function __MasterController(){
    
    'use strict';

    angular.module('AppTrakt.master', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/master', {
        templateUrl: 'master/master.html',
        controller: 'MasterController'
      });
    }])

    .controller('MasterController', MasterController);
    
    MasterController.$inject = ['$scope', 'MasterRepository', '$http']
    
    function MasterController($scope, MasterRepository, $http) {
        
        $scope.movies = [];
        $scope.currentPage = 1;
        $scope.pageSize = 4;
        $scope.limit = $scope.pageSize;
        $scope.loading = false;
        
        function loadMore(_pageSize) {
            $scope.loading = true;
            if(_pageSize) $scope.limit += _pageSize;
            MasterRepository.getMoviesPopular($scope.currentPage, $scope.limit)
            .then(function(result){
                $scope.loading = false;
                $scope.movies = result.data;
            }, function(data) {
                $scope.loading = false;
                console.log("Erro ao carregar os dados.", data);
            });
        };
        $scope.loadMore = loadMore;
        
        loadMore();
    };
    
})();