/**
 * Created by prof.BOLA on 3/18/2017.
 */

(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .directive("sdImagesAuthz", ImageAuthz);

    ImageAuthz.$inject = [];

    function ImageAuthz (){
        var ddo = {
            bindToController : true,
            controller : ImagesAuthzController,
            controllerAs : "vm",
            restrict : "A",
            scope : {
                authz: '=' // update parent scope with authz evals
            },
            link : link
        };

        return ddo;

        function link (scope, element, attrs) {
            console.log("ImageAuthzDirective", scope)
        }
    }

    ImagesAuthzController.$inject = ["$scope",
                                     "spa-demo.authn.Authn",
                                     "spa-demo.subjects.ImageAuthz"];

    function ImagesAuthzController ($scope, Authn, ImageAuthz) {
        var vm = this;
        vm.authz = {};
        vm.authz.authenticated = false;
        vm.authz.canCreate     = false
        vm.authz.canQuery      = false;
        vm.authz.canUpdate     = false;
        vm.authz.canDelete     = false;
        vm.authz.canGetDetails = false;
        vm.authz.canUpdateItem = canUpdateItem;

        ImagesAuthzController.prototype.resetAccess = function () {
            this.authz.canCreate     = false;
            this.authz.canQuery      = true;
            this.authz.canUpdate     = false;
            this.authz.canDelete     = false;
            this.authz.canGetDetails = true;
        }

        activate();
        return;
        //////////////////////////
        function activate() {
            vm.resetAccess();
            // $scope.$watch(Authn.getCurrentUser, newUser);
            newUser();
        }

        function newUser(user, prevUser) {
            console.log("newUser=", user, ", prev=",prevUser);
            vm.authz.canQuery  = true;
            vm.authz.authenticated = ImageAuthz.isAuthenticated();
            if (vm.authz.authenticated) {
                vm.authz.canCreate     = true;
                vm.authz.canUpdate     = true;
                vm.authz.canDelete     = true;
                vm.authz.canGetDetails = true;
            } else {
                vm.resetAccess();
            }
        }

       function canUpdateItem (item) {
           return ImageAuthz.isAuthenticated();
       }
    }
})();