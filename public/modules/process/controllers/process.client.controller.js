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
		// Step based rules
		var rulesSteps = {
			// If role of worker is not involved in one step, we don't show the step
			noStep: function (step) {
				return _.intersection(step.roles, $scope.user.roles_process).length > 0;
			}
		};
		// Artifact based ruled
		var rulesArtifacts = {
			// Novice gets all possible contacts for process worker with intermedia level or more
			helpFromExperimented: function (artifact, s) {
				return $scope.user.experience === 'Novice' &&
						artifact.type === 'Contact' &&
						artifact.source_type === 'User' &&
						artifact.source_id.experience !== undefined &&
						artifact.source_id.experience !== 'Novice';
			},
			// Interview team gets other expert contacts
			helpFromExpertForInterview: function (artifact, s) {
				return _.contains($scope.user.roles_process, 'Interviewer') &&
						artifact.type === 'Contact' &&
						artifact.source_type === 'User' &&
						artifact.source_id.experience === 'Experimented';
			},
			// Artifacts for the roles with the given level of experience
			simpleTargetBasedRule: function (artifact, s) {
				return _.intersection(artifact.target_roles, $scope.user.roles_process).length > 0 &&
						_.contains(artifact.target_experiences, $scope.user.experience);
			},
			// Interview team gets list of working experiance of candidate
			interviewTeamCandidatsArtifacts: function (artifact, s) {
				return _.contains($scope.user.roles_process, 'Interviewer') &&
						artifact.source_type === 'User' &&
						artifact.source_id === $scope.currentCandidate._id;
			},
			// Admission Comission gets contact information of all involved members of the interview
			admissionCommisionInterviewer: function (artifact, s) {
				return _.contains($scope.user.roles_process, 'Admission Commision') &&
						artifact.type === 'Contact' &&
						artifact.source_type === 'User' &&
						_.contains(artifact.source_id.roles_process, 'Interviewer');
			},
			// Admission comission sees CV of candidate
			admisstionCommissionCandidates: function (artifact, s) {
				return _.contains($scope.user.roles_process, 'Admission Commision') &&
						artifact.source_type === 'User' &&
						artifact.source_id._id === $scope.currentCandidate._id;
			},
			// Dean sees the Weisung Admission Criteria
			deanCommissionCandidates: function (artifact, s) {
				return _.contains($scope.user.roles_process, 'Dean') &&
						artifact.source_type === 'User' &&
						artifact.source_id === $scope.currentCandidate._id;
			},
			// Study Assistant sees the Weisung Admission Criteria
			studyAssistantCandidates: function (artifact, s) {
				return _.contains($scope.user.roles_process, 'Study Assistant') &&
						artifact.source_type === 'User' &&
						artifact.source_id === $scope.currentCandidate._id;
			}
		};



		$scope.step = {
			id: $stateParams.processId
		};

		$scope.candidates = Candidates.query();

		$scope.findOne = function (callback) {
			if ($stateParams.candidateId) {
				$scope.currentCandidate = Candidates.get({
					candidateId: $stateParams.candidateId
				}, callback);
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
			var func = function () {
				Steps.query(function () {
					_.each($scope.steps, function (s) {
						if ($scope.stepValid(s))
							$scope.results[s._id] = getResults(s);
					});
				});
			};

			if (!$scope.currentCandidate)
				$scope.findOne(func);
			else
				func();



		};

	}
]);
