'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Artifact Schema
 */
var ArtifactSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Artifact name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Artifact', ArtifactSchema);