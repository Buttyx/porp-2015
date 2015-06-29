'use strict';

//Setting up route
angular.module('process').config(['$stateProvider',
	function($stateProvider) {
		// Process state routing
		$stateProvider.
		state('process', {
			url: '/process/:processId',
			templateUrl: 'modules/process/views/process.client.view.html'
		}).
		state('results', {
			url: '/process/:processId/:candidateId',
			templateUrl: 'modules/process/views/process.client.view.html'
		});
	}
]);
