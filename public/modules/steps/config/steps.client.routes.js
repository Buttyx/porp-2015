'use strict';

//Setting up route
angular.module('steps').config(['$stateProvider',
	function($stateProvider) {
		// Steps state routing
		$stateProvider.
		state('listSteps', {
			url: '/steps',
			templateUrl: 'modules/steps/views/list-steps.client.view.html'
		}).
		state('createStep', {
			url: '/steps/create',
			templateUrl: 'modules/steps/views/create-step.client.view.html'
		}).
		state('viewStep', {
			url: '/steps/:stepId',
			templateUrl: 'modules/steps/views/list-steps.client.view.html'
		}).
		state('editStep', {
			url: '/steps/:stepId/edit',
			templateUrl: 'modules/steps/views/edit-step.client.view.html'
		});
	}
]);
