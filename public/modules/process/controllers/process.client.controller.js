'use strict';

angular.module('process').controller('ProcessController', ['$scope', '$stateParams', 'Candidates', 'Authentication',
	function($scope, $stateParams, Candidates, Authentication) {
		$scope.user = Authentication.user;

		$scope.step = {
			id: $stateParams.processId
		};

		$scope.candidates = Candidates.query();

		$scope.findOne = function () {
			if ($stateParams.candidateId) {
				$scope.currentCandidate = Candidates.get({
					candidateId: $stateParams.candidateId
				});
			}
		};

		$scope.selectCandidate = function (candidate) {
			angular.forEach($scope.candidates, function (c) {
				c.active = false;
			});

			$scope.currentCandidate = candidate;
			candidate.active = true;
		};

	}
]);
