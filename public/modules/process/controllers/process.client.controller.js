'use strict';

angular.module('process').controller('ProcessController', ['$scope', '$stateParams', 'Candidates', 'Artifacts', 'Users', 'Steps', 'Authentication',
	function($scope, $stateParams, Candidates, Artifacts, Users, Steps, Authentication) {
		$scope.user = Authentication.user;
		$scope.artifacts = Artifacts.query();
		$scope.steps = Steps.query();
		$scope.currentCandidate = undefined;
		$scope.results = {};

		var getResults;
		var _ = window._;
		var rulesSteps = {
			// If role of worker is not involved in one step, we don't show the step
			noStep: function (step) {
				return _.intersection(step.roles, $scope.user.roles_process).length > 0;
			}
		};
		var rulesArtifacts = {
			// Novice gets all possible contacts for process worker with intermedia level or more
			helpFromExperimented: function (a, s) {
				return $scope.user.experience === 'Novice' &&
						a.type === 'Contact' &&
						a.source_type === 'User' &&
						a.source_id.experience !== 'Novice';
			},
			// Interview team gets other expert contacts
			helpFromExpertForInterview: function (a, s) {
				return _.contains($scope.user.roles_process, 'Interviewer') &&
						a.type === 'Contact' &&
						a.source_type === 'User' &&
						a.source_id.experience === 'Experimented';
			},
			// Artifacts for the good person
			simpleTargetBasedRule: function (a, s) {
				return _.intersection(a.target_roles, $scope.user.roles_process).length > 0 &&
						_.contains(a.target_experiences, $scope.user.experience);
			}
		};



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

		getResults = function (step) {
			var results = [];

			_.each($scope.artifacts, function (a) {
				var ok = false;
				_.each(rulesArtifacts, function (rule) {
					if (rule(a, step))
						ok = true;
				});

				if (ok)
					results.push(a);
			});

			return results;
		};

		$scope.stepValid = function (step) {
			var stepValidation = true;

			_.each(rulesSteps, function (rule) {
				if (!rule(step))
					stepValidation = false;
			});

			return stepValidation;
		};

		$scope.generateResults = function () {
			if (!$scope.currentCandidate)
				$scope.findOne();

			Steps.query(function () {
				_.each($scope.steps, function (s) {
					if ($scope.stepValid(s))
						$scope.results[s._id] = getResults(s);
				});
			});
		};

	}
]);
