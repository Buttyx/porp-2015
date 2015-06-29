'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Step = mongoose.model('Step'),
	_ = require('lodash');

/**
 * Create a Step
 */
exports.create = function(req, res) {
	var step = new Step(req.body);
	step.user = req.user;

	step.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(step);
		}
	});
};

/**
 * Show the current Step
 */
exports.read = function(req, res) {
	res.jsonp(req.step);
};

/**
 * Update a Step
 */
exports.update = function(req, res) {
	var step = req.step ;

	step = _.extend(step , req.body);

	step.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(step);
		}
	});
};

/**
 * Delete an Step
 */
exports.delete = function(req, res) {
	var step = req.step ;

	step.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(step);
		}
	});
};

/**
 * List of Steps
 */
exports.list = function(req, res) {
	Step.find().sort('-created').populate('user', 'displayName').exec(function(err, steps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(steps);
		}
	});
};

/**
 * Step middleware
 */
exports.stepByID = function(req, res, next, id) {
	Step.findById(id).populate('user', 'displayName').exec(function(err, step) {
		if (err) return next(err);
		if (! step) return next(new Error('Failed to load Step ' + id));
		req.step = step ;
		next();
	});
};

/**
 * Step authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.step.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};
