'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var steps = require('../../app/controllers/steps.server.controller');

	// Steps Routes
	app.route('/steps')
		.get(steps.list)
		.post(users.requiresLogin, steps.create);

	app.route('/steps/:stepId')
		.get(steps.read)
		.put(users.requiresLogin, steps.hasAuthorization, steps.update)
		.delete(users.requiresLogin, steps.hasAuthorization, steps.delete);

	// Finish by binding the Step middleware
	app.param('stepId', steps.stepByID);
};
