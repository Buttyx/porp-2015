'use strict';

(function() {
	// Artifacts Controller Spec
	describe('Artifacts Controller Tests', function() {
		// Initialize global variables
		var ArtifactsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Artifacts controller.
			ArtifactsController = $controller('ArtifactsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Artifact object fetched from XHR', inject(function(Artifacts) {
			// Create sample Artifact using the Artifacts service
			var sampleArtifact = new Artifacts({
				name: 'New Artifact'
			});

			// Create a sample Artifacts array that includes the new Artifact
			var sampleArtifacts = [sampleArtifact];

			// Set GET response
			$httpBackend.expectGET('artifacts').respond(sampleArtifacts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.artifacts).toEqualData(sampleArtifacts);
		}));

		it('$scope.findOne() should create an array with one Artifact object fetched from XHR using a artifactId URL parameter', inject(function(Artifacts) {
			// Define a sample Artifact object
			var sampleArtifact = new Artifacts({
				name: 'New Artifact'
			});

			// Set the URL parameter
			$stateParams.artifactId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/artifacts\/([0-9a-fA-F]{24})$/).respond(sampleArtifact);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.artifact).toEqualData(sampleArtifact);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Artifacts) {
			// Create a sample Artifact object
			var sampleArtifactPostData = new Artifacts({
				name: 'New Artifact'
			});

			// Create a sample Artifact response
			var sampleArtifactResponse = new Artifacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Artifact'
			});

			// Fixture mock form input values
			scope.name = 'New Artifact';

			// Set POST response
			$httpBackend.expectPOST('artifacts', sampleArtifactPostData).respond(sampleArtifactResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Artifact was created
			expect($location.path()).toBe('/artifacts/' + sampleArtifactResponse._id);
		}));

		it('$scope.update() should update a valid Artifact', inject(function(Artifacts) {
			// Define a sample Artifact put data
			var sampleArtifactPutData = new Artifacts({
				_id: '525cf20451979dea2c000001',
				name: 'New Artifact'
			});

			// Mock Artifact in scope
			scope.artifact = sampleArtifactPutData;

			// Set PUT response
			$httpBackend.expectPUT(/artifacts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/artifacts/' + sampleArtifactPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid artifactId and remove the Artifact from the scope', inject(function(Artifacts) {
			// Create new Artifact object
			var sampleArtifact = new Artifacts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Artifacts array and include the Artifact
			scope.artifacts = [sampleArtifact];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/artifacts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleArtifact);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.artifacts.length).toBe(0);
		}));
	});
}());