'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Artifact = mongoose.model('Artifact'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Artifact
 */
exports.create = function(req, res) {
	var artifact = new Artifact(req.body);
	artifact.user = req.user;

	artifact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(artifact);
		}
	});
};

/**
 * Show the current Artifact
 */
exports.read = function(req, res) {
	res.jsonp(req.artifact);
};

/**
 * Update a Artifact
 */
exports.update = function(req, res) {
	var artifact = req.artifact ;

	artifact = _.extend(artifact , req.body);

	artifact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(artifact);
		}
	});
};

/**
 * Delete an Artifact
 */
exports.delete = function(req, res) {
	var artifact = req.artifact ;

	artifact.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(artifact);
		}
	});
};

/**
 * List of Artifacts
 */
exports.list = function(req, res) {
	Artifact.find().sort('-created').populate('user').exec(function(err, artifacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(artifacts);
		}
	});
};

/**
 * Artifact middleware
 */
exports.artifactByID = function(req, res, next, id) {
	Artifact.findById(id).populate('source_id').exec(function(err, artifact) {
		if (err) return next(err);
		if (! artifact) return next(new Error('Failed to load Artifact ' + id));
		req.artifact = artifact ;
		next();

	});
};

/**
 * Artifact authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.artifact.user.id !== req.user.id) {
	//	return res.status(403).send('User is not authorized');
	//}
	next();
};
