'use strict';

//Setting up route
angular.module('process').config(['$stateProvider',
	function($stateProvider) {
		// Process state routing
		$stateProvider.
		state('process', {
			url: '/processs/worker',
			templateUrl: 'modules/process/views/process-worker.client.view.html'
		});
	}
]);
