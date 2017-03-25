/**
 * Created by prof.BOLA on 3/8/2017.
 */
(function () {

    "use strict";

    angular
        .module("spa-demo.authn")
        .factory("spa-demo.authn.checkMe", CheckMeFactory);

    CheckMeFactory.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];

    function CheckMeFactory($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.server_url + "/authn/checkme");
    }
})();