/**
 * @function Realiza permissão de string html para bind
 * @author julio_c.silva@outlook.com
 * @since 28/10/2016
 */
(function __trusted() {

    'use strict';

    angular
        .module(modules.filters)
        .filter('trusted', trusted);

    trusted.$inject = ['$sce'];

    function trusted($sce) {

        return function (value) {

            if (value === null || value === undefined)
                return "";

            try {
                value = $sce.trustAsHtml(value);
            }
            catch (e) {
                console.error("Erro no filtro 'trustedHtml'.");
            };
            
            return value;
        }
    };

})();