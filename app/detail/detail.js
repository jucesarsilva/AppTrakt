/**
 * @function controller for Detail
 * @param
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function __DetailController(){
    
    'use strict';

    angular.module('AppTrakt.detail', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/detail', {
        templateUrl: 'detail/detail.html',
        controller: 'DetailController'
      });
    }])
    
    .controller('DetailController', DetailController);
       
    DetailController.$inject = ['$scope', 'DetailRepository', '$routeParams'];
    
    function DetailController($scope, DetailRepository, $routeParams) {
        
        $scope.id = $routeParams.id;
        $scope.detail = {};
        
        function loadMovie(__callback) {
            $scope.loading = true;
            DetailRepository.getSummary($scope.id)
            .then(function(result){
                $scope.loading = false;
                $scope.detail.movie = result.data;
                if(__callback) __callback();
            }, function(data) {
                $scope.loading = false;
                console.log("Erro ao carregar os dados.", data);
                if(__callback) __callback();
            });
        };
        
        function loadComments(__callback) {
            $scope.loading = true;
            DetailRepository.getComments($scope.id)
            .then(function(result){
                $scope.loading = false;
                $scope.detail.comments = result.data;
                if(__callback) __callback();
            }, function(data) {
                $scope.loading = false;
                console.log("Erro ao carregar os dados.", data);
                if(__callback) __callback();
            });
        };
        
        function loadRatings(__callback) {
            $scope.loading = true;
            DetailRepository.getRatings($scope.id)
            .then(function(result){
                $scope.loading = false;
                $scope.detail.ratings = result.data;
                if(__callback) __callback();
            }, function(data) {
                $scope.loading = false;
                console.log("Erro ao carregar os dados.", data);
                if(__callback) __callback();
            });
        };
        
        
        loadMovie(function(){
            loadComments(function(){
                loadRatings();
            }.bind(this))
        }.bind(this));
        
    };
    
})();