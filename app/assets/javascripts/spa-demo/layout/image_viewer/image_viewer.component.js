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
			$ctrl.imageCaption = imageCaption;
			$ctrl.nextImage = nextImage;
			$ctrl.previousImage = previousImage;

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

			function setCurrentIndex(index) {
				console.log("setCurrentIndex", $ctrl.name, index);
				if ($ctrl.images && $ctrl.images.length > 0) {
					if (index >= $ctrl.images.length) {
						$ctrl.currentIndex = 0;
					} else if (index < 0) {
						$ctrl.currentIndex = $ctrl.images.length - 1;
					} else {
						$ctrl.currentIndex = index;
					}
				} else {
					$ctrl.currentIndex = 0;
				}
			}

			function imageUrl(object) {
				if (!object) { return null; }
				return object.image_id ? object.image_id : object.id;
			}

			function nextImage() {
				setCurrentIndex($ctrl.currentIndex + 1);
			}

			function previousImage() {
				setCurrentIndex($ctrl.currentIndex - 1);
			}

			function imageCaption(object) {
				if (!object) { return null; }
				return object.image_id ? object.image_caption : object.caption;
			}
		}
})();