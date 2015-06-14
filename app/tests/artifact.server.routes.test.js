'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Artifact = mongoose.model('Artifact'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, artifact;

/**
 * Artifact routes tests
 */
describe('Artifact CRUD tests', function() {
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

		// Save a user to the test db and create new Artifact
		user.save(function() {
			artifact = {
				name: 'Artifact Name'
			};

			done();
		});
	});

	it('should be able to save Artifact instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Artifact
				agent.post('/artifacts')
					.send(artifact)
					.expect(200)
					.end(function(artifactSaveErr, artifactSaveRes) {
						// Handle Artifact save error
						if (artifactSaveErr) done(artifactSaveErr);

						// Get a list of Artifacts
						agent.get('/artifacts')
							.end(function(artifactsGetErr, artifactsGetRes) {
								// Handle Artifact save error
								if (artifactsGetErr) done(artifactsGetErr);

								// Get Artifacts list
								var artifacts = artifactsGetRes.body;

								// Set assertions
								(artifacts[0].user._id).should.equal(userId);
								(artifacts[0].name).should.match('Artifact Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Artifact instance if not logged in', function(done) {
		agent.post('/artifacts')
			.send(artifact)
			.expect(401)
			.end(function(artifactSaveErr, artifactSaveRes) {
				// Call the assertion callback
				done(artifactSaveErr);
			});
	});

	it('should not be able to save Artifact instance if no name is provided', function(done) {
		// Invalidate name field
		artifact.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Artifact
				agent.post('/artifacts')
					.send(artifact)
					.expect(400)
					.end(function(artifactSaveErr, artifactSaveRes) {
						// Set message assertion
						(artifactSaveRes.body.message).should.match('Please fill Artifact name');
						
						// Handle Artifact save error
						done(artifactSaveErr);
					});
			});
	});

	it('should be able to update Artifact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Artifact
				agent.post('/artifacts')
					.send(artifact)
					.expect(200)
					.end(function(artifactSaveErr, artifactSaveRes) {
						// Handle Artifact save error
						if (artifactSaveErr) done(artifactSaveErr);

						// Update Artifact name
						artifact.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Artifact
						agent.put('/artifacts/' + artifactSaveRes.body._id)
							.send(artifact)
							.expect(200)
							.end(function(artifactUpdateErr, artifactUpdateRes) {
								// Handle Artifact update error
								if (artifactUpdateErr) done(artifactUpdateErr);

								// Set assertions
								(artifactUpdateRes.body._id).should.equal(artifactSaveRes.body._id);
								(artifactUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Artifacts if not signed in', function(done) {
		// Create new Artifact model instance
		var artifactObj = new Artifact(artifact);

		// Save the Artifact
		artifactObj.save(function() {
			// Request Artifacts
			request(app).get('/artifacts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Artifact if not signed in', function(done) {
		// Create new Artifact model instance
		var artifactObj = new Artifact(artifact);

		// Save the Artifact
		artifactObj.save(function() {
			request(app).get('/artifacts/' + artifactObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', artifact.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Artifact instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Artifact
				agent.post('/artifacts')
					.send(artifact)
					.expect(200)
					.end(function(artifactSaveErr, artifactSaveRes) {
						// Handle Artifact save error
						if (artifactSaveErr) done(artifactSaveErr);

						// Delete existing Artifact
						agent.delete('/artifacts/' + artifactSaveRes.body._id)
							.send(artifact)
							.expect(200)
							.end(function(artifactDeleteErr, artifactDeleteRes) {
								// Handle Artifact error error
								if (artifactDeleteErr) done(artifactDeleteErr);

								// Set assertions
								(artifactDeleteRes.body._id).should.equal(artifactSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Artifact instance if not signed in', function(done) {
		// Set Artifact user 
		artifact.user = user;

		// Create new Artifact model instance
		var artifactObj = new Artifact(artifact);

		// Save the Artifact
		artifactObj.save(function() {
			// Try deleting Artifact
			request(app).delete('/artifacts/' + artifactObj._id)
			.expect(401)
			.end(function(artifactDeleteErr, artifactDeleteRes) {
				// Set message assertion
				(artifactDeleteRes.body.message).should.match('User is not logged in');

				// Handle Artifact error error
				done(artifactDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Artifact.remove().exec();
		done();
	});
});