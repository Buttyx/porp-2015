'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Step Schema
 */
var StepSchema = new Schema({
	number: {
		type: Number,
		default: '0',
		required: 'Please fill Step number'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Step name',
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
	roles: {
		type: Array,
		default: []
	}
});

mongoose.model('Step', StepSchema);
