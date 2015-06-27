'use strict';

(function() {
	// Steps Controller Spec
	describe('Steps Controller Tests', function() {
		// Initialize global variables
		var StepsController,
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

			// Initialize the Steps controller.
			StepsController = $controller('StepsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Step object fetched from XHR', inject(function(Steps) {
			// Create sample Step using the Steps service
			var sampleStep = new Steps({
				name: 'New Step'
			});

			// Create a sample Steps array that includes the new Step
			var sampleSteps = [sampleStep];

			// Set GET response
			$httpBackend.expectGET('steps').respond(sampleSteps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.steps).toEqualData(sampleSteps);
		}));

		it('$scope.findOne() should create an array with one Step object fetched from XHR using a stepId URL parameter', inject(function(Steps) {
			// Define a sample Step object
			var sampleStep = new Steps({
				name: 'New Step'
			});

			// Set the URL parameter
			$stateParams.stepId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/steps\/([0-9a-fA-F]{24})$/).respond(sampleStep);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.step).toEqualData(sampleStep);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Steps) {
			// Create a sample Step object
			var sampleStepPostData = new Steps({
				name: 'New Step'
			});

			// Create a sample Step response
			var sampleStepResponse = new Steps({
				_id: '525cf20451979dea2c000001',
				name: 'New Step'
			});

			// Fixture mock form input values
			scope.name = 'New Step';

			// Set POST response
			$httpBackend.expectPOST('steps', sampleStepPostData).respond(sampleStepResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Step was created
			expect($location.path()).toBe('/steps/' + sampleStepResponse._id);
		}));

		it('$scope.update() should update a valid Step', inject(function(Steps) {
			// Define a sample Step put data
			var sampleStepPutData = new Steps({
				_id: '525cf20451979dea2c000001',
				name: 'New Step'
			});

			// Mock Step in scope
			scope.step = sampleStepPutData;

			// Set PUT response
			$httpBackend.expectPUT(/steps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/steps/' + sampleStepPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid stepId and remove the Step from the scope', inject(function(Steps) {
			// Create new Step object
			var sampleStep = new Steps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Steps array and include the Step
			scope.steps = [sampleStep];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/steps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStep);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.steps.length).toBe(0);
		}));
	});
}());