'use strict';

// Artifacts controller
angular.module('artifacts').controller('ArtifactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Artifacts',
	function($scope, $stateParams, $location, Authentication, Artifacts) {
		$scope.authentication = Authentication;

		// Create new Artifact
		$scope.create = function() {
			// Create new Artifact object
			var artifact = new Artifacts ({
				name: this.name
			});

			// Redirect after save
			artifact.$save(function(response) {
				$location.path('artifacts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Artifact
		$scope.remove = function(artifact) {
			if ( artifact ) { 
				artifact.$remove();

				for (var i in $scope.artifacts) {
					if ($scope.artifacts [i] === artifact) {
						$scope.artifacts.splice(i, 1);
					}
				}
			} else {
				$scope.artifact.$remove(function() {
					$location.path('artifacts');
				});
			}
		};

		// Update existing Artifact
		$scope.update = function() {
			var artifact = $scope.artifact;

			artifact.$update(function() {
				$location.path('artifacts/' + artifact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Artifacts
		$scope.find = function() {
			$scope.artifacts = Artifacts.query();
		};

		// Find existing Artifact
		$scope.findOne = function() {
			$scope.artifact = Artifacts.get({ 
				artifactId: $stateParams.artifactId
			});
		};
	}
]);