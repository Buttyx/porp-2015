'use strict';

// Steps controller
angular.module('steps').controller('StepsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Steps', 'Artifacts',
	function($scope, $stateParams, $location, Authentication, Steps, Artifacts) {
		$scope.authentication = Authentication;
		$scope.step = {};
		$scope.artifacts = [];
		$scope.newArtifacts = Artifacts.query();

		// Create new Step
		$scope.create = function() {
			// Create new Step object
			var step = new Steps ($scope.step);

			// Redirect after save
			step.$save(function(response) {
				$location.path('steps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Step
		$scope.remove = function(step) {
			if ( step ) {
				step.$remove();

				for (var i in $scope.steps) {
					if ($scope.steps [i] === step) {
						$scope.steps.splice(i, 1);
					}
				}
			} else {
				$scope.step.$remove(function() {
					$location.path('steps');
				});
			}
		};

		// Update existing Step
		$scope.update = function() {
			var step = $scope.step;

			step.$update(function() {
				$location.path('steps/' + step._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Steps
		$scope.find = function() {
			$scope.steps = Steps.query();
		};

		// Find existing Step
		$scope.findOne = function() {
			$scope.artifacts = Artifacts.query({}, function () {
				$scope.step = Steps.get({
					stepId: $stateParams.stepId
				}, function (data) {
					angular.forEach($scope.artifacts, function (a1) {
						angular.forEach(data.artifacts, function (a2) {
							if (a1._id === a2._id) {
								a1.selected = true;
							}
						});
					});
				});
			});


		};
	}
]);
