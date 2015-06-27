'use strict';

// Steps controller
angular.module('steps').controller('StepsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Steps',
	function($scope, $stateParams, $location, Authentication, Steps) {
		$scope.authentication = Authentication;

		// Create new Step
		$scope.create = function() {
			// Create new Step object
			var step = new Steps ({
				name: this.name
			});

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
			$scope.step = Steps.get({ 
				stepId: $stateParams.stepId
			});
		};
	}
]);