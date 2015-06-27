'use strict';

//Steps service used to communicate Steps REST endpoints
angular.module('steps').factory('Steps', ['$resource',
	function($resource) {
		return $resource('steps/:stepId', { stepId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);