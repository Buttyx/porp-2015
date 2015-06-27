'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Artifact = mongoose.model('Artifact'),
	Schema = mongoose.Schema;

/**
 * Candidate Schema
 */
var CandidateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Candidate name',
		trim: true
	},
	created: {
		type: Date
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},

	// PORP specifics fields
	nationality: {
		type: String,
		default: 'ch',
		required: 'Please fill Candidate nationality',
		trim: true
	},
	relevantBachelor: {
		type: Boolean,
		default: false,
		trim: true
	},
	certifiedUniversity: {
		type: Boolean,
		default: false,
		trim: true
	},
	grades: {
		type: Number,
		default: '0',
		required: 'Please fill Candidate grades',
		trim: true
	},
	contactInformation: {
		type: String
	},
	academicQualifications: {
		type: String
	},
	professionalExperience: {
		type: String
	},
	onlinePresence: {
		type: Array
	}
});

CandidateSchema.pre('save', function(next) {

	if (!this.created) {
		this.created = Date.now;
		Artifact.create({
			name: 'Contact Information ' + this.name,
			type: 'Contact',
			data: this.contactInformation,
			source_id: this,
			source_type: 'User',
			target_experiences: [],
			target_roles: []
		}, function (err) {
			console.error(err);
		});

		Artifact.create({
			name: 'Academic Qualifications for ' + this.name,
			type: 'Text',
			data: this.academicQualifications,
			source_id: this,
			source_type: 'User',
			target_experiences: [],
			target_roles: []
		}, function (err) {
			console.error(err);
		});

		Artifact.create({
			name: 'Professional Experience of ' + this.name,
			type: 'Text',
			data: this.professionalExperience,
			source_id: this,
			source_type: 'User',
			target_experiences: [],
			target_roles: []
		}, function (err) {
			console.error(err);
		});
	}

	next();
});

mongoose.model('Candidate', CandidateSchema);
