/**
 * Created by prof.BOLA on 3/18/2017.
 */

(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .component("sdThingsSelector", {
            templateUrl : thingsSelectorTemplateUrl,
            controller : ThingsSelectorController,
            bindings : {
                authz: '<'
            }
        })
        .component("sdThingsEditor", {
            templateUrl : thingsEditorTemplateUrl,
            controller : ThingsEditorController,
            bindings : {
                authz: '<'
            }
        });

    thingsSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function thingsSelectorTemplateUrl (APP_CONFIG) {
        return APP_CONFIG.thing_selector_html;
    }

    thingsEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function thingsEditorTemplateUrl (APP_CONFIG) {
        return APP_CONFIG.thing_editor_html;
    }

    ThingsSelectorController.$inject = ["$scope","$stateParams", "spa-demo.authz.Authz", "spa-demo.subjects.Things"];

    function ThingsSelectorController ($scope, $stateParams, Authz, Things) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log("ThingSelectorController", $scope);
            $scope.$watch(function () { return Authz.getAuthorizedUserId();},
                function () {
                    if (!$stateParams.id) {
                        $ctrl.items = Image.query();
                    }})
        };

        return;
        //////////////////////////
    }

    ThingsEditorController.$inject = ["$scope", "$q", "$state",
                                        "$stateParams",
                                        "spa-demo.authz.Authz",
                                        "spa-demo.subjects.Things",
                                        "spa-demo.subjects.ThingImage"];

    function ThingsEditorController ($scope, $q, $state, $stateParams, Authz, Things, ThingImage) {
        var $ctrl            = this;
        $ctrl.clear          = clear;
        $ctrl.remove         = remove;
        $ctrl.update         = update;
        $ctrl.create         = create;
        $ctrl.haveDirtyLinks = haveDirtyLinks;

        $ctrl.$onInit = function () {
            console.log("ThingsEditorController", $scope);
            $scope.$watch(
                function () {
                    return Authz.getAuthorizedUserId();
                },
                function () {
                    if ($stateParams.id) {
                        reload($stateParams.id);
                    } else {
                        newResource();
                    }
                }
            );
        };

        return;
        ////////////////////////////////

        function newResource() {
            $ctrl.thing = new Things();
            return $ctrl.thing;
        };

        function reload(thingId) {
            var itemId = thingId ? thingId : $ctrl.thing.id;
            console.log("re/loading thing", itemId);
            $ctrl.images = ThingImage.query({thing_id: itemId});
            $ctrl.thing = Things.get({id:itemId});
            $ctrl.images.$promise.then(
              function () {
                  angular.forEach($ctrl.images, function (ti) {
                      ti.originalPriority = ti.priority;
                  });
              });
            $q.all([$ctrl.thing.$promise, $ctrl.images.$promise]).catch(handleError);
        }

        function haveDirtyLinks() {
            for (var i = 0; $ctrl.images && i < $ctrl.images.length; i++) {
                var ti = $ctrl.images[i];
                if (ti.toRemove || ti.originalPriority != ti.priority) {
                    return true;
                }
            }
            return false;
            // angular.forEach($ctrl.images,function (ti) {
            //     if (ti.toRemove || ti.originalPriority != ti.priority) {
            //         // console.log("To Remove")
            //         return true;
            //     };
            // })
            // return false;
        }

        function clear() {
            newResource();
            $state.go(".", {id:null});
        }

        function create() {
            $ctrl.thing.errors = null;
            $ctrl.thing.$save().then(
                function () {
                    $state.go(".", {id: $ctrl.thing.id});
                },
                handleError
            )
        }

        function update() {
            $ctrl.thing.errors = null;
            var promises = $ctrl.thing.$update();
            updateImageLinks(promises);
        }

        function updateImageLinks(promise) {
            var promises = [];
            if (promise) { promises.push(promise) }
            angular.forEach($ctrl.images, function (ti) {
                if (ti.toRemove) {
                    promises.push(ti.$remove());
                } else if (ti.originalPriority != ti.priority) {
                    promises.push(ti.$update());
                }
            });

            console.log("waiting for promises", promises);
            $q.all(promises).then(
                function (reponse) {
                    console.log("promise.all response", response);
                    $scope.thingForm.$setPristine();
                    reload();
                },
                handleError
            )
        }

        function remove() {
            $ctrl.thing.$delete().then(
                function () {
                    clear();
                },
                handleError
            )
        }

        function handleError(response) {
            if (response.data) {
                $ctrl.thing["errors"] = response.data.errors;
            }
            if (!$ctrl.thing.errors) {
                $ctrl.thing.errors = {};
                $ctrl.thing.errors = [response];
            }
            $scope.thingForm.$setPristine();
        }

    }
})();