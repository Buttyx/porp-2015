'use strict';

//Artifacts service used to communicate Artifacts REST endpoints
angular.module('artifacts').factory('Artifacts', ['$resource',
	function($resource) {
		return $resource('artifacts/:artifactId', { artifactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);