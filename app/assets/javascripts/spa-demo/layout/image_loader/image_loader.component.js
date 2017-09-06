(function() {
	'use strict';

	angular
		.module("spa-demo.layout")
		.component("sdImageLoader", {
			templateUrl: templateUrl,
			controller: ImageLoaderController,
			bindings: {
				resultDataUri: "&"
			},
			transclude: true
		});

		templateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
		function templateUrl(APP_CONFIG) {
			return APP_CONFIG.image_loader_html;
		}

		// ImageLoaderController.$inject = ["$scope", "UploadDataUrl"];
		// function ImageLoaderController($scope, UploadDataUrl) {
		ImageLoaderController.$inject = ["$scope"];
		function ImageLoaderController($scope) {
			var $ctrl = this;
			$ctrl.debug = debug;

			$ctrl.$onInit = function() {
				console.log("ImageLoaderController", $scope);
				$scope.$watch(() => $ctrl.dataUri,
											() => $ctrl.resultDataUri({dataUri: $ctrl.dataUri}) );
				// $scope.$watch(() => $ctrl.file,
				// 							() => {
				// 								makeObjectUrl();
				// 								makeDataUri(); 
				// 							});
			}

			return;
			///////////////////////////////////////////
			// function makeDataUri() {
			// 	$ctrl.dataUri = null;
			// 	if ($ctrl.file) {
			// 		UploadDataUrl.dataUrl($ctrl.file, true).then(
			// 			dataUri => {
			// 				$ctrl.dataUri = dataUri;
			// 				$ctrl.resultDataUri({dataUri: $ctrl.dataUri});
			// 			});
			// 	}
			// }

			// function makeObjectUrl() {
			// 	$ctrl.objectUrl = null;
			// 	if ($ctrl.file) {
			// 		UploadDataUrl.dataUrl($ctrl.file, false).then(
			// 			objectUrl => $ctrl.objectUrl = objectUrl );
			// 	}
			// }
			function debug() {
				console.log("ImageLoaderController", $scope);
			}
		}
})();