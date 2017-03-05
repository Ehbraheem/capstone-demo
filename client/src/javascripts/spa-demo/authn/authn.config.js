/**
 * Created by prof.BOLA on 2/25/2017.
 */
(function () {

    'use strict';

    angular
        .module('spa-demo.authn')
        .config(AuthnConfig);

    AuthnConfig.$inject = ["$authProvider", "spa-demo.config.APP_CONFIG"];

    function AuthnConfig( $authProvider, APP_CONFIG) {
        $authProvider.configure({
            apiUrl : APP_CONFIG.server_url,
            // To remove this error "Possibly unhandled rejection: {"reason":"unauthorized","errors":["No credentials"]}"
            // validateOnpageLoad : false
        });
    };
})();
