/**
 * Created by prof.BOLA on 2/26/2017.
 */
(function () {

    'use strict';

    angular
        .module("spa-demo.authn")
        .service("spa-demo.authn.Authn", Authn);

    Authn.$inject = ["$auth"];

    function Authn ($auth) {

        var service = this;

        service.signup = signup;

        return;
        /////////////////////
        function signup (registration) {
            return $auth.submitRegistration(registration);
        }
    }
})();