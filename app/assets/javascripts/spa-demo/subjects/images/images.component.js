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
            },
            require: {
                imagesAuthz: "^sdImagesAuthz"
            }
        });

    imageSelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
    function imageSelectorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.image_selector_html;
    }

    ImageSelectorController.$inject = ["$scope",
                                        "$stateParams",
                                        "spa-demo.authz.Authz",
                                        "spa-demo.subjects.Image"];
    function ImageSelectorController ($scope, $stateParams, Authz, Image) {
        var $ctrl = this;

        $ctrl.$onInit = function () {
            console.log("ImageSelectorController", $stateParams, $scope);
            $scope.$watch(function () { return Authz.getAuthorizedUserId();},
                          function () {
                            if (!$stateParams.id) {
                              $ctrl.items = Image.query();
                          }})
        }

        return;
        /////////////////////////////
    }

    imageEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];

    function imageEditorTemplateUrl(APP_CONFIG) {
        return APP_CONFIG.image_editor_html;
    }

    ImageEditorController.$inject = ["$scope", "$q",
                                    "$stateParams", "$state",
                                    "spa-demo.authz.Authz",
                                    "spa-demo.layout.DataUtils",
                                    "spa-demo.subjects.Image",
                                    "spa-demo.subjects.ImageThing",
                                    "spa-demo.subjects.ImageLinkableThing",
                                    ];

    function ImageEditorController ($scope, $q, $stateParams, $state, Authz,
                                    DataUtils, Image, ImageThing, ImageLinkableThing) {
        var $ctrl = this;
        $ctrl.selected_linkables = [];
        $ctrl.create = create;
        $ctrl.clear = clear;
        $ctrl.update = update;
        $ctrl.remove = remove;
        $ctrl.linkThings = linkThings;
        $ctrl.setImageContent = setImageContent;

        $ctrl.$onInit = function () {
            console.log("ImageSelectorController", $scope);
            // reload($stateParams.id);
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
        }

        return;
        /////////////////////////////

        function newResource() {
            $ctrl.item = new Image();
            $ctrl.imagesAuthz.newItem($ctrl.item);
            return $ctrl.item;
        }

        function reload(imageId) {
            var itemId = imageId ? imageId : $ctrl.item.id;
            console.log("re/loading image", itemId);
            $ctrl.item = Image.get({id:itemId});
            $ctrl.things = ImageThing.query({image_id: itemId});
            $ctrl.linkable_things = ImageLinkableThing.query({image_id:itemId});
            $ctrl.imagesAuthz.newItem($ctrl.item);

            $q.all([$ctrl.item.$promise,
                $ctrl.things.$promise]).catch(handleError);
        }

        function clear() {
            if (!$ctrl.item.id) {
                $state.reload();
            } else {
                $state.go(".", {id:null})
            }
        }

        function setImageContent(dataUri) {
            console.log("setImageContent", dataUri ? dataUri.length : null);
            $ctrl.item.image_content = DataUtils.getContentFromDataUri(dataUri);
        }
        
        function create() {
            $ctrl.item.errors = null;
            $ctrl.item.$save().then(
                function() {
                    $state.go(".", {id:$ctrl.item.id});
                },
                handleError
            );
        }

        function update() {
            $ctrl.item.errors = null;
            var update = $ctrl.item.$update();
            linkThings(update);
        }
        
        function linkThings(parentPromise) {
            var promises = []
            if (parentPromise) { promises.push(parentPromise); }
            angular.forEach($ctrl.selected_linkables, function (linkable) {
                var resource = ImageThing.save({image_id:$ctrl.item.id}, {thing_id: linkable});
                promises.push(resource.$promise);
            });

            $ctrl.selected_linkables = [];
            console.log("waiting for promises", promises);
            $q.all(promises).then(
                function (response) {
                    console.log("promise.all response", response);
                    console.log("$scope ", $scope);
                    $scope.imageForm.$setPristine();
                    reload();
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
            $scope.imageForm.$setPristine();
        }
    }
})();