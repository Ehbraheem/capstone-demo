/**
 * Created by prof.BOLA on 2/26/2017.
 */
(function () {

    'use strict';

    angular
        .module("spa-demo.authn")
        .service("spa-demo.authn.Authn", Authn);

    Authn.$inject = ["$auth", "$q"];

    function Authn ($auth, $q) {

        var service = this;

        service.signup = signup;

        service.user = null;

        service.isAuthenticated = isAuthenticated;

        service.getCurrentUserName = getCurrentUserName;

        service.getCurrentUserId = getCurrentUserId;

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
            return service.user!=null && service.user["uid"]!=null
        }

        function getCurrentUserName () {
            return service.user ? service.user.name : null;
        }

        function getCurrentUserId() {
            return service.user != null ? service.user.id : null;
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
            var defered = $q.defer();

            return result.then(
                function (response) {
                    console.log("login complete", response);
                    service.user = response;
                    defered.resolve(response);
                },
                function (response) {
                    var formatted_errors = {
                        errors: {
                            full_messages: response.errors
                        }
                    };
                    console.log("Login failed", response);
                    defered.reject(formatted_errors);
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