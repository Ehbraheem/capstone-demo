(function() {
	'use strict';

	angular
		.module("spa-demo.layout")
		.component("sdImageLoader", {
			templateUrl: templateUrl,
			controller: ImageLoaderController,
			bindings: {
				resultDataUrl: "&"
			},
		});

		templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
		function templateUrl(APP_CONFIG) {
			return APP_CONFIG.image_loader_html;
		}

		ImageLoaderController.$inject = ["$scope", "UploadDataUrl"];
		function ImageLoaderController($scope, UploadDataUrl) {
			var $ctrl = this;
			$ctrl.debug = debug;

			$ctrl.$onInit = function() {
				console.log("ImageLoaderController", $scope);
			}

			return;
			///////////////////////////////////////////
			function makeObjectUrl() {
				$ctrl.objectUrl = null;
				if ($ctrl.file) {
					UploadDataUrl.dataUrl($ctrl.file, false).then(
						objectUrl => $ctrl.objectUrl = objectUrl );
				}
			}
			function debug() {
				console.log("ImageLoaderController", $scope);
			}
		}
})();