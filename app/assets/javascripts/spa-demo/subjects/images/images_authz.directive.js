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
                                     "spa-demo.subjects.ImageAuthz"];

    function ImagesAuthzController ($scope, ImageAuthz) {
        var vm = this;
        vm.authz = {};
        vm.authz.canUpdateItem = canUpdateItem;
        vm.newItem = newItem;

        activate();
        return;
        //////////////////////////
        function activate() {
            // $scope.$watch(Authn.getCurrentUser, newUser);
            vm.newItem(null);
        }

        function newItem(item) {
            ImageAuthz.getAuthorizedUser().then(
                (user) => authzUserItem(item, user),
                (user) => authzUserItem(item, user)
            )
        }

        function authzUserItem(item, user) {
            console.log("new item/Authz", item, user);

            vm.authz.authenticated = ImageAuthz.isAuthenticated();
            vm.authz.canQuery      = ImageAuthz.canQuery();
            vm.authz.canCreate     = ImageAuthz.canCreate();

            if (item && item.$promise) {
                vm.authz.canUpdate     = false;
                vm.authz.canDelete     = false;
                vm.authz.canGetDetails = false;
                item.$promise.then( () => checkAccess(item); );
            } else {
                checkAccess(item);
            }
        }

        function checkAccess(item) {
            vm.authz.canUpdate     = ImageAuthz.canUpdate(item);
            vm.authz.canDelete     = ImageAuthz.canDelete(item);
            vm.authz.canGetDetails = ImageAuthz.canGetDetails(item);
            console.log("checkAccess", item, vm.authz);
        }

       function canUpdateItem (item) {
           return ImageAuthz.canUpdate(item);
       }
    }
})();