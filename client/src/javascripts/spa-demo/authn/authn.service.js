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

        service.user = null;

        service.isAuthenticated = isAuthenticated;

        service.getCurrentUserName = getCurrentUserName;

        service.getCurrentUser = getCurrentUser;

        service.login = login;

        service.logout = logout;

        activate();

        return;

        /////////////////////
        function activate() {
            $auth.validateUser().then(
                function(user) {
                    service.user = user;
                    console.log("validated user", user);
                },
                function(user) {}
            )
        }

        function signup (registration) {
            return $auth.submitRegistration(registration);
        };

        function isAuthenticated () {
            return service.user && service.user["uid"]
        }

        function getCurrentUserName () {
            return service.user ? service.user.name : null;
        }

        function getCurrentUser () {
            return service.user;
        }
        function login(credentials) {
            console.log("login", credentials.email);
            var result = $auth.submitLogin({
                email: credentials["email"],
                password: credentials["password"]
            });
            return result.then(
                function (response) {
                    console.log("login complete", response);
                    service.user = response;
                }
            )
        }
        function logout() {
            return $auth.signOut()
                .then(
                    function(response) {
                        service.user = null;
                        console.log("Logout complete", response);
                    },
                    function(response) {
                        service.user = null;
                        console.log("Logout incomplete", response);
                        alert(response.status + ":" + response.statusText);
                    }
                )
        }
    }
})();