'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var artifacts = require('../../app/controllers/artifacts.server.controller');

	// Artifacts Routes
	app.route('/artifacts')
		.get(artifacts.list)
		.post(users.requiresLogin, artifacts.create);

	app.route('/artifacts/:artifactId')
		.get(artifacts.read)
		.put(users.requiresLogin, artifacts.hasAuthorization, artifacts.update)
		.delete(users.requiresLogin, artifacts.hasAuthorization, artifacts.delete);

	// Finish by binding the Artifact middleware
	app.param('artifactId', artifacts.artifactByID);
};
