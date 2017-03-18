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
        "spa-demo.subjects.Image"];

    function ImageEditorController ($scope, $stateParams, Image) {
        var $ctrl = this;

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
    }
})();