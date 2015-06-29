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
	},

	// PORP
	type: {
		type: String,
		trim: true,
		enum: ['Document', 'Link', 'Contact', 'Text', 'Task'],
		default: 'Document'
	},
	data: {
		type: String,
		default: ''
	},
	source_id: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	source_type: {
		type: String,
		default: ''
	},
	target_experiences: {
		type: Array,
		default: []
	},
	target_roles: {
		type: Array,
		default: []
	}
});

mongoose.model('Artifact', ArtifactSchema);
