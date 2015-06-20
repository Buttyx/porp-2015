'use strict';

angular.module('process').controller('ProcessController', ['$scope', '$stateParams', 'Authentication',
	function($scope, $stateParams, Authentication) {
		$scope.user = Authentication.user;

		$scope.step = {
			id: $stateParams.processId
		};

	}
]);
