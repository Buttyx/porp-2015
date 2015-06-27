'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Step = mongoose.model('Step'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, step;

/**
 * Step routes tests
 */
describe('Step CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Step
		user.save(function() {
			step = {
				name: 'Step Name'
			};

			done();
		});
	});

	it('should be able to save Step instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Step
				agent.post('/steps')
					.send(step)
					.expect(200)
					.end(function(stepSaveErr, stepSaveRes) {
						// Handle Step save error
						if (stepSaveErr) done(stepSaveErr);

						// Get a list of Steps
						agent.get('/steps')
							.end(function(stepsGetErr, stepsGetRes) {
								// Handle Step save error
								if (stepsGetErr) done(stepsGetErr);

								// Get Steps list
								var steps = stepsGetRes.body;

								// Set assertions
								(steps[0].user._id).should.equal(userId);
								(steps[0].name).should.match('Step Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Step instance if not logged in', function(done) {
		agent.post('/steps')
			.send(step)
			.expect(401)
			.end(function(stepSaveErr, stepSaveRes) {
				// Call the assertion callback
				done(stepSaveErr);
			});
	});

	it('should not be able to save Step instance if no name is provided', function(done) {
		// Invalidate name field
		step.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Step
				agent.post('/steps')
					.send(step)
					.expect(400)
					.end(function(stepSaveErr, stepSaveRes) {
						// Set message assertion
						(stepSaveRes.body.message).should.match('Please fill Step name');
						
						// Handle Step save error
						done(stepSaveErr);
					});
			});
	});

	it('should be able to update Step instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Step
				agent.post('/steps')
					.send(step)
					.expect(200)
					.end(function(stepSaveErr, stepSaveRes) {
						// Handle Step save error
						if (stepSaveErr) done(stepSaveErr);

						// Update Step name
						step.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Step
						agent.put('/steps/' + stepSaveRes.body._id)
							.send(step)
							.expect(200)
							.end(function(stepUpdateErr, stepUpdateRes) {
								// Handle Step update error
								if (stepUpdateErr) done(stepUpdateErr);

								// Set assertions
								(stepUpdateRes.body._id).should.equal(stepSaveRes.body._id);
								(stepUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Steps if not signed in', function(done) {
		// Create new Step model instance
		var stepObj = new Step(step);

		// Save the Step
		stepObj.save(function() {
			// Request Steps
			request(app).get('/steps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Step if not signed in', function(done) {
		// Create new Step model instance
		var stepObj = new Step(step);

		// Save the Step
		stepObj.save(function() {
			request(app).get('/steps/' + stepObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', step.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Step instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Step
				agent.post('/steps')
					.send(step)
					.expect(200)
					.end(function(stepSaveErr, stepSaveRes) {
						// Handle Step save error
						if (stepSaveErr) done(stepSaveErr);

						// Delete existing Step
						agent.delete('/steps/' + stepSaveRes.body._id)
							.send(step)
							.expect(200)
							.end(function(stepDeleteErr, stepDeleteRes) {
								// Handle Step error error
								if (stepDeleteErr) done(stepDeleteErr);

								// Set assertions
								(stepDeleteRes.body._id).should.equal(stepSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Step instance if not signed in', function(done) {
		// Set Step user 
		step.user = user;

		// Create new Step model instance
		var stepObj = new Step(step);

		// Save the Step
		stepObj.save(function() {
			// Try deleting Step
			request(app).delete('/steps/' + stepObj._id)
			.expect(401)
			.end(function(stepDeleteErr, stepDeleteRes) {
				// Set message assertion
				(stepDeleteRes.body.message).should.match('User is not logged in');

				// Handle Step error error
				done(stepDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Step.remove().exec();
		done();
	});
});