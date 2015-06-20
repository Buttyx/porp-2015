'use strict';

//Setting up route
angular.module('process').config(['$stateProvider',
	function($stateProvider) {
		// Process state routing
		$stateProvider.
		state('process', {
			url: '/processs/:processId',
			templateUrl: 'modules/process/views/process.client.view.html'
		});
	}
]);
