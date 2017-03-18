/**
 * Created by prof.BOLA on 3/8/2017.
 */
( function() {

    "use strict";

    angular
        .module("spa-demo.authn")
        .directive("sdAuthnCheck", AuthnCheck);

    AuthnCheck.$inject = [];

    function AuthnCheck () {
        var ddo = {
            bindToController: true,
            controller: AuthnCheckController,
            controllerAs: "idVM",
            restrict: "A",
            scope: false,
            link: link
        };
        return ddo;
        function link(scope, element, attrs) {
            console.log("AutnCheck",scope);
        }
    }

    AuthnCheckController.$inject = ["$auth",
                                    "spa-demo.authn.whoAmI",
                                    "spa-demo.authn.checkMe"];

    function AuthnCheckController($auth, whoAmI, checkMe) {

        var vm = this;
        vm.client = {};
        vm.server = {};
        vm.getClientUser = getClientUser;
        vm.whoAmI = getServerUser;
        vm.checkMe = checkServerUser;

        return;
        ///////////////////////
        function getClientUser() {
            vm.client.currentUser = $auth.user;
        }
        function getServerUser() {
            vm.server.whoAmI = null;
            whoAmI.get().$promise.then(
                function (value) {
                    console.log(value);
                    return vm.server.whoAmI = value;
                },
                function (value) {
                    return vm.server.whoAmI = value;
                }
            );
        }
        function checkServerUser() {
            vm.server.checkMe = null;
            checkMe.get().$promise.then(
                function (value) {
                    vm.server.checkMe = value;
                },
                function (value) {
                    vm.server.checkMe = value;
                }
            );
        }
    }

})();