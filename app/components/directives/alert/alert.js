/**
 * @function Directiva para mensagens
 * @author julio_c.silva@outlook.com
 * @since 28/10/2016
 */
(function __alert{
 
    'use strict';

    angular
        .module('services')
        .directive('alert', $alert)
        .directive('autoClose', $autoClose);
    
    $alert.$inject = ['$notification'];
    $autoClose.$inject = ['$timeout'];
    
    function $alert($notification) {
        return {
            restrict: 'E',
            scope: {},
            controller: function () { },
            templateUrl: 'alert.html',
            replace: true,
            link: function ( $scope, elem, attrs ) {
                $scope.notifications = $notification.get();
                $scope.$watch('notifications', function () {
                    $scope.notifications = $notification.get();
                });
                $scope.remove = function (id) {
                    $notification.remove(id);
                };
            }
        };
    };

    function $autoClose($timeout) {
        var increase = 100;
        var delay = 8000;
        return {
            restrict: 'A',
            require: '^alert',
            link: {
                pre: function ($scope, elem, attrs, alert) {},
                post: function ($scope, elem, attrs, alert) {
                    delay += increase;
                    alert = $scope.$parent;
                    attrs.$observe("autoClose", function (autoClose) {
                        if (autoClose) {
                            $timeout(function () {
                                $(elem).fadeTo(500, 0).slideUp(500, function () {
                                    delay += -increase;
                                    var id = $(elem).data('index');
                                    alert.remove(id);
                                });
                            }, delay);
                        }
                    });
                }
            }
        };
    };

})();