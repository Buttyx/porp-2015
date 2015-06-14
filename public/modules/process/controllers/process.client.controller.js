'use strict';

angular.module('process').controller('ProcessController', ['$scope', '$stateParams', 'Authentication',
	function($scope, $stateParams, Authentication) {
		$scope.authentication = Authentication;

		// Find existing Process step
		$scope.findOne = function() {
			$scope.step = {
				id: $stateParams.processId
			};
		};
	}
]);
