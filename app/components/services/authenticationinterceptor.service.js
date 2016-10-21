/**
 * @function Interceptor
 * @author julio_c.silva@outlook.com
 * @since 20/10/2016
 * @returns
 */
(function () {

    'use strict';

    angular
        .module('AppTrakt.services')
        .factory('AuthenticationInterceptor', AuthenticationInterceptorService)
        .config(Config);
    
    function Config($httpProvider, $locationProvider, $provide) {
        $locationProvider.html5Mode(false);
        $httpProvider.interceptors.push('AuthenticationInterceptor');
    };
    
    AuthenticationInterceptorService.$inject = ['$q', '$injector'];
    
    function AuthenticationInterceptorService($q, $injector) {

        //Constantes de configuração da service
        var constants = {
            AUTHENTICATIONTOKEN: 'authenticationtoken'
        };

        //Controle interno de Mecânica
        var controll = {
            authentication_on_progress: false
        };

        //Obter os componentes utilizados internamente na service: 'interceptação do request'
        var components = {
            $http: undefined,
            ipCookie: undefined,
            ApiTraktSetting: undefined,
            ConfigRepository: undefined,
            $q: undefined,
            loaded: false
        };

        //Objeto token
        var token = {
            access_token: undefined,
            expires_in: undefined,
            expires: undefined,
            statusCode: undefined,
            token_type: undefined,
            domain:undefined,
            secure: true,
            expirationUnit: undefined
        };

        //Fila de promessas
        var queue = [];

        //Configuração da service
        var service = {
            constants: constants,
            controll: controll,
            components: components,
            token: token,
            request: request,
            response: response,
            responseError: responseError,
            getReturn: getReturn,
            queue: queue,
            executeQueue: executeQueue,
            clearQueue: clearQueue,
            deleteExpiredCookie: deleteExpiredCookie,
            getAuthenticationToken: getAuthenticationToken,
            setAuthenticationToken: setAuthenticationToken,
            setAuthenticationHeader: setAuthenticationHeader,
            setAuthenticationCookie: setAuthenticationCookie,
            getAuthenticationCookie:getAuthenticationCookie,
            existAuthenticationToken: existAuthenticationToken,
            isAuthenticationRequest: isAuthenticationRequest,
            formatAuthenticationToken: formatAuthenticationToken,
            getAuthenticationCookieExpiration: getAuthenticationCookieExpiration
        };

        function request (config) {

            if (!service.components.loaded) {
                service.components.loaded = true;
                service.components.$http = $injector.get('$http');
                service.components.ipCookie = $injector.get('ipCookie');
                service.components.ApiTraktSetting = $injector.get('ApiTraktSetting');
                service.components.ConfigRepository = $injector.get('ConfigRepository');
                service.components.$q = $injector.get('$q');
            }
            
            config.headers["Content-Type"] = "application/json";
            config.headers["Trakt-Api-Key"] = service.components.ApiTraktSetting.clientID;
            config.headers["Trakt-Api-Version"] = service.components.ApiTraktSetting.apiVersion;
            
            //Ignora o request da url 'Account/GetAuthenticationToken'
            if (service.isAuthenticationRequest(config))
                return config || $q.when(config);
            
            //Caso algum navegador não exclua o cookie de autenticação, o sistema o fará 
            service.deleteExpiredCookie();

            //GET/UPDATE token
            if (!service.existAuthenticationToken()) {
                if (!service.controll.authentication_on_progress)
                    service.getAuthenticationToken();
            }
            else {
                var cookie = service.getAuthenticationCookie();
                service.token = cookie.token;
            }
            
            //Autorização de cabeçalho
            config = service.setAuthenticationHeader(config);
            
            //Retorno de promisse
            return service.getReturn($q, config);          
        };        
        
        /**
         * @function - depois de cada resposta completa, desbloqueia o próximo request.
         * @params - response
         */
        function response ( response ) {
            return response;
        };

        /**
         * @function - depois de cada responta de erro, desbloqueia o próximo request.
         * @param - responseError
         */
        function responseError(responseError) {

            switch (responseError.status) {
                case 0:
                    console.log("Requisi&ccedil&atildeo atingiu o tempo limite.");
                    break;
                case 412:
                    console.log(responseError.data);
                    break;
                case 500:
                    console.log(responseError.data);
                    break;
                case 404:
                    console.log("N&atildeo foram encontrados dados.");
                    break;
                case 401:
                    console.log("Erro na autentica&ccedil&atildeo do request.");
                    break;
                default:
                    console.log("Ocorreu um erro inesperado.");
            }
            
            return service.components.$q.reject(responseError);
        };

        /**
         * Realiza o retorno do request ou,
         * armazenas os resquest em uma fila até que o request do token termine.
         * @param $q
         * @param config
         */
        function getReturn ($q, config) {
            if (!service.existAuthenticationToken()) {
                var deferred = $q.defer();
                service.queue.push(function () {
                    config = service.setAuthenticationHeader(config);
                    deferred.resolve(config);
                });
                return deferred.promise;
            }
            else {
                return config || $q.when(config);
            }
        };

        /**
         * @function - Após a obtenção do token de Autenticação executa todas os requests armazenados na fila
         */
        function executeQueue() {
            if (service.queue.length === 0)
                return;
            for (var i = 0; i < service.queue.length; i++)
                service.queue[i]();
            service.clearQueue();
        };

        /**
         * @function - Limpeza da fila de requisições.
         */
        function clearQueue() {
            service.queue = [];
        };

        /**
         * @function - verifica se o request é de obtenção do token
         * @param config
         */
        function isAuthenticationRequest(config) {
            if (config.url.match(/oauth/g) != null || config.url.match(/.html/g) != null)
                return true;
            return false;
        };

        /**
         * Request para atualização de token
         * @param $http
         */
        function getAuthenticationToken() {

            service.controll.authentication_on_progress = true;

            var data = {
                 code: service.components.ApiTraktSetting.code,
                 client_id: service.components.ApiTraktSetting.clientID,
                 client_secret: service.components.ApiTraktSetting.secretClient,
                 redirect_uri: service.components.ApiTraktSetting.redirectURI,
                 grant_type: "client_credentials"
            };
             
            service.components.ConfigRepository.getToken(data, function(result){
                service.components.ConfigRepository.ApiTraktSetting.token = {
                    access_token: result.data.access_token,
                    token_type: result.data.token_type,
                    expires_in: result.data.expires_in
                };
                
                service.setAuthenticationCookie(service.formatAuthenticationToken(result.data));
                service.controll.authentication_on_progress = false;
                service.executeQueue();
                
            }, function() {
                console.log(result);
            });
        };

        /**
         * @function - Seta um token para uso interno da service
         * @param $http
         */
        function setAuthenticationToken(token) {
            service.setAuthenticationCookie(service.formatAuthenticationToken(token) );
        };

        /**
         * @function Realiza a formatação do objeto token que irá ser gravado como cookie
         * @param $http
         * @returns service.token (objeto formatado)
         */
        function formatAuthenticationToken(token) {
            service.token.access_token   = token.access_token;
            service.token.expires_in     = token.expires_in - 60;
            service.token.statusCode     = token.statusCode;
            service.token.token_type     = token.token_type;
            service.token.domain         = getDomain();
            service.token.secure         = true
            service.token.expires        = getAuthenticationCookieExpiration(service.token.expires_in);
            service.token.expirationUnit = 'seconds';
            return service.token;
        };

        /**
         * @function - determina a expiração (tempo de válidade) do cookie
         * @param seconds - data atual + quantidade de segundos
         */
        function getAuthenticationCookieExpiration (seconds) {
            var date = new Date();
            date.setTime( date.getTime() + (seconds * 1000) );
            return date;
        };

        /**
         * Escreve no cabeçalho o token de Autenticação
         * @param
         */
        function setAuthenticationHeader (config) {
            if ( service.getAuthenticationCookie() != undefined && !service.isAuthenticationRequest(config) )
                config.headers.Authorization = service.token.token_type + ' ' + service.token.access_token;
            return config;
        };

        /**
         * Verifica existe um cookie criado
         * @param
         */
        function existAuthenticationToken() {
            if (service.getAuthenticationCookie() != undefined) {
                return true;
            }
            else {
                service.token.access_token = undefined;
                service.token.expires_in = undefined;
                service.token.expires = undefined;
                service.token.statusCode = undefined;
                service.token.token_type = undefined;
                service.token.domain = undefined;
                service.token.secure = true;
                service.token.expirationUnit = undefined;
            }
            return false;
        };

        /**
         * Seta o cookie de Autenticação
         * @param token
         */
        function setAuthenticationCookie(token) {
            var cookie = {
                value: {
                    'token': token
                },
                params: {
                    expirationUnit: token.expirationUnit,
                    expires: token.expires_in,
                    path: '/'
                },
            };
            service.components.ipCookie(service.constants.AUTHENTICATIONTOKEN, cookie.value, cookie.params);
        };

        /**
         * Retorna o cookie de Autenticação
         * @param
         */
        function getAuthenticationCookie() {
            return service.components.ipCookie(service.constants.AUTHENTICATIONTOKEN);
        };

        /**
         * Deleta o cookie caso ele tenha expirado.
         * @param
         */
        function deleteExpiredCookie() {
            var cookie = getAuthenticationCookie();
            if (cookie != undefined) {
                var cookieDate = new Date(cookie.token.expires);
                var nowDate = new Date();
                if (nowDate > cookieDate)
                    service.components.ipCookie.remove(service.constants.AUTHENTICATIONTOKEN);
            }
        };
        return service;
    };

})();