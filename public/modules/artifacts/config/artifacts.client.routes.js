'use strict';

//Setting up route
angular.module('artifacts').config(['$stateProvider',
	function($stateProvider) {
		// Artifacts state routing
		$stateProvider.
		state('listArtifacts', {
			url: '/artifacts',
			templateUrl: 'modules/artifacts/views/list-artifacts.client.view.html'
		}).
		state('createArtifact', {
			url: '/artifacts/create',
			templateUrl: 'modules/artifacts/views/create-artifact.client.view.html'
		}).
		state('viewArtifact', {
			url: '/artifacts/:artifactId',
			templateUrl: 'modules/artifacts/views/list-artifacts.client.view.html'
		}).
		state('editArtifact', {
			url: '/artifacts/:artifactId/edit',
			templateUrl: 'modules/artifacts/views/edit-artifact.client.view.html'
		});
	}
]);
