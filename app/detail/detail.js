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
       
    DetailController.$inject = ['$scope', 'DetailRepository', 'ImageRepository', '$routeParams'];
    
    function DetailController($scope, DetailRepository, ImageRepository, $routeParams) {
        
        $scope.id = $routeParams.id;
        $scope.detail = {};
        
        function loadMovie(__callback) {
            $scope.loading = true;
            DetailRepository.getSummary($scope.id)
            .success(function(data, status, headers, config){
                $scope.loading = false;
                $scope.detail.movie = data;
                getImage($scope.detail.movie);
                if(__callback) __callback();
            })
            .error(function(data) {
                $scope.loading = false;
                console.log("Erro ao carregar os dados.", data);
                if(__callback) __callback();
            });
        };
        
        /**
         * @function load comments
         * @param {object} __callback
         * @returns
         */
        function loadComments(__callback) {
            $scope.loading = true;
            DetailRepository.getComments($scope.id)
            .success(function(data, status, headers, config){
                $scope.loading = false;
                $scope.detail.comments = data;
                if(__callback) __callback();
            })
            .error(function(data) {
                $scope.loading = false;
                console.log("Erro ao carregar os dados.", data);
                if(__callback) __callback();
            });
        };
        
        /**
         * @function load rating
         * @param {object} __callback
         * @returns
         */
        function loadRatings(__callback) {
            $scope.loading = true;
            DetailRepository.getRatings($scope.id)
            .success(function(data, status, headers, config){
                $scope.loading = false;
                $scope.detail.ratings = data;
                if(__callback) __callback();
            })
            .error(function(data) {
                $scope.loading = false;
                console.log("Erro ao carregar os dados.", data);
                if(__callback) __callback();
            });
        };
        
        /**
         * @function get movie's images
         * @param {int} id
         * @returns
         */
        function getImage(movie) {
            ImageRepository.getImageResource(movie.ids.tmdb)
            .success(function(data, status, headers, config){
                movie.images = data;
                movie.loading = true;
                $('#movie_image_' + movie.ids.tmdb).on('load', function () {
                    movie.loading = false;
                    $scope.safeApply();
                }.bind(this));
            })
            .error(function(data) {
                console.log("Erro ao carregar os dados.", data);
            })
        };
        
        /**
         * @function force angular diggest
         * @param
         * @returns
         */
        $scope.safeApply = function __safeApply() {
            var $scope, fn, force = false;
            if (arguments.length === 1) {
                var arg = arguments[0];
                if (typeof arg === 'function') {
                    fn = arg;
                } else {
                    $scope = arg;
                }
            } else {
                $scope = arguments[0];
                fn = arguments[1];
                if (arguments.length === 3) {
                    force = !!arguments[2];
                }
            }
            $scope = $scope || this;
            fn = fn || function () { };

            if (force || !$scope.$$phase) {
                $scope.$apply ? $scope.$apply(fn) : $scope.apply(fn);
            } else {
                fn();
            }
        };
        
        loadMovie(function(){
            loadComments(function(){
                loadRatings();
            }.bind(this))
        }.bind(this));
        
    };
    
})();