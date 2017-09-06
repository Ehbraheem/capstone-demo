(function() {
	'use strict';

	angular
		.module("spa-demo.layout")
		.component("sdImageViewer", {
			templateUrl: templateUrl,
			controller: ImageViewerController,
			bindings: {
				name: "@",
				images: "<"
			}
		});

		templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
		function templateUrl(APP_CONFIG) {
			return APP_CONFIG.image_viewer_html;
		}

		ImageViewerController.$inject = ["$scope"];
		function ImageViewerController($scope) {
			const $ctrl = this;
			$ctrl.imageId = imageId;
			$ctrl.imageUrl = imageUrl;
			$ctrl.isCurrentIndex = isCurrentIndex;

			$ctrl.$onInit = () => {
				console.log($ctrl.name, "ImageViewerController", $scope);
			}
			return;
			/////////////////////////
			function isCurrentIndex(index) {
				return index === $ctrl.currentIndex;
			}

			function imageId(object) {
				if (!object) { return null; }
				return object.image_id ? object.image_content_url : object.content_url;
			}

			function imageUrl(object) {
				if (!object) { return null; }
				return object.image_id ? object.image_id : object.id;
			}
		}
})();