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

    ThingsSelectorController.$inject = ["$scope","$stateParams", "spa-demo.subjects.Things"];

    function ThingsSelectorController ($scope, $stateParams, Things) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log("ThingSelectorController", $scope);
            if (!$stateParams.id) {
                $ctrl.things = Things.query();
            }
        }

        return;
        //////////////////////////
    }

    ThingsEditorController.$inject = ["$scope", "$state", "$stateParams", "spa-demo.subjects.Things"];

    function ThingsEditorController ($scope, $state, $stateParams, Things) {
        var $ctrl    = this;
        $ctrl.clear  = clear;
        $ctrl.remove = remove;
        $ctrl.update = update;
        $ctrl.create = create;

        $ctrl.$onInit = function () {
            console.log("ThingsEditorController", $scope);
            if ($stateParams.id) {
                $ctrl.thing = Things.get({id: $stateParams.id});
            } else {
                newResource();
            }
        };

        return;
        ////////////////////////////////

        function newResource() {
            $ctrl.thing = new Things();
            return $ctrl.thing;
        };

        function clear() {
            newResource();
            state.go(".", {id:null});
        }

        function create() {
            $scope.thingForm.$setpristine();
            $ctrl.thing.errors = null;
            $ctrl.thing.$save().then(
                function () {
                    $state.go(".", {id: $ctrl.item.id});
                },
                handleError
            )
        }

        function update() {
            $ctrl.thing.$update().then(
                function () {
                    $state.reload();
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
        }

    }
})();