/**
 * Created by prof.BOLA on 3/18/2017.
 */
(function () {

    "use strict";

    angular
        .module("spa-demo.subjects")
        .component("sdImageSelector", {
            templateUrl : imageSelectorTemplateUrl,
            controller : ImageSelectorController
        })
        .component("sdImageEditor", {
            templateUrl : imageEditorTemplateUrl,
            controller : ImageEditorController
        });

    imageSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function imageSelectorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.image_selector_html;
    }

    ImageSelectorController.$inject = ["$scope",
                                        "$stateParams",
                                        "spa-demo.subject.Image"];
    function ImageSelectorController ($scope, Image) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log("ImageSelectorController", $scope);
            if (!$stateParams.id) {
                $ctrl.items = Image.query();
            }
        }

        return;
        /////////////////////////////
    }
})();