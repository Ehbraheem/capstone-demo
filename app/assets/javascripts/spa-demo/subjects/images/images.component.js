/**
 * Created by prof.BOLA on 3/18/2017.
 */
(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .component("sdImageSelector", {
            templateUrl : imageSelectorTemplateUrl,
            controller : ImageSelectorController,
            bindings : {
                authz: '<'
            }
        })
        .component("sdImageEditor", {
            templateUrl : imageEditorTemplateUrl,
            controller : ImageEditorController,
            bindings : {
                authz: '<'
            }
        });

    imageSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function imageSelectorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.image_selector_html;
    }

    ImageSelectorController.$inject = ["$scope",
                                        "$stateParams",
                                        "spa-demo.subjects.Image"];
    function ImageSelectorController ($scope, $stateParams, Image) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log("ImageSelectorController", $stateParams, $scope);
            if (!$stateParams.id) {
                $ctrl.items = Image.query();
            }
        }

        return;
        /////////////////////////////
    }

    imageEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];

    function imageEditorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.image_editor_html;
    }

    ImageEditorController.$inject = ["$scope",
                                    "$stateParams",
                                    "$state",
                                    "spa-demo.subjects.Image"];

    function ImageEditorController ($scope, $stateParams, $state, Image) {
        var $ctrl = this;
        $ctrl.create = create;
        $ctrl.clear = clear;
        $ctrl.update = update;
        $ctrl.remove = remove;

        $ctrl.$onInit = function () {
            console.log("ImageSelectorController", $scope);
            if ($stateParams.id) {
                $ctrl.item = Image.get({id: $stateParams.id});
            } else {
                newResource();
            }
        }

        return;
        /////////////////////////////

        function newResource() {
            $ctrl.item = new Image();
            return $ctrl.item;
        }

        function clear() {
            newResource();
            $state.go(".", {id:null})
        }
        
        function create() {
            $scope.imageForm.$setPristine();
            $ctrl.item.errors = null;
            $ctrl.item.$save().then(
                function() {
                    $state.go(".", {id:$ctrl.item.id});
                },
                handleError
            );
        }

        function update() {
            $scope.imageForm.$setPristine();
            $ctrl.item.errors = null;
            $ctrl.item.$update().then(
                function () {
                    console.log("update complete", $ctrl.item);
                    $state.reload();
                },
                handleError
            )
        }

        function remove() {
            $ctrl.item.errors = null;
            $ctrl.item.$delete().then(
                function () {
                    console.log("remove complete", $ctrl.item);
                    clear();
                },
                handleError
            )
        }
        
        function handleError(response) {
            console.log("error",response);
            if (response.data) {
                $ctrl.item["errors"] = response.data.errors;
            }
            if (!$ctrl.item.errors) {
                $ctrl.item["errors"] = {};
                $ctrl.item["errors"]["full_messages"] = [response];
            }
        }
    }
})();