"use strict";

var _dbuser = require("../db/dbuser");

var _dbuser2 = _interopRequireDefault(_dbuser);

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _validator = require("../middleware/validator");

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createMeetup = function (req, res) {
	// eslint-disable-next-line no-console
	var result = _joi2.default.validate(req.body, _validator2.default.meetup);
	if (result.error) {
		return res.status(400).send(result.error.details[0].message);
	}
	var newMeetup = {
		meetup_id: _dbuser2.default.meetup.length + 1,
		createdOn: new Date().toLocaleString(),
		location: req.body.location,
		imagePath: req.file.path,
		topic: req.body.topic,
		happeningOn: new Date(req.body.happeningOn).toGMTString(),
		tag: req.body.tag
	};
	_dbuser2.default.meetup.push(newMeetup);
	return res.json({
		status: 201,
		data: newMeetup,
		message: "Meetup successfully created"
	});
};
exports.singleMeetup = function (req, res) {
	var singleMeetup = _dbuser2.default.meetup.find(function (c) {
		return c.meetup_id === parseInt(req.params.meetup_id);
	});
	if (!singleMeetup) {
		return res.json({
			status: "404",
			error: "No Meetup found"
		});
	}
	return res.json({
		status: 200,
		data: singleMeetup,
		message: "Meetup retrieve successfully "
	});
};
exports.getMeetup = function (req, res) {
	if (!_dbuser2.default.meetup) {
		return res.json({
			status: "500",
			error: "Internal Server Error"
		});
	}
	res.json({
		status: 200,
		count: _dbuser2.default.meetup.length,
		data: _dbuser2.default.meetup,
		message: "All Meetup retrieve successfully"
	});
};
exports.upcomingMeetup = function (req, res) {
	var date = new Date().toLocaleString();
	var upmeetup = _dbuser2.default.meetup.filter(function (obj) {
		return obj.happeningOn > date;
	});
	if (upmeetup.length === 0) {
		return res.json({
			status: 404,
			error: "No Up ComingMeetup Found"
		});
	}
	return res.json({
		status: 200,
		data: upmeetup,
		message: "All Up Coming Meetup retrieve Successfully"
	});
};
exports.createQuestion = function (req, res) {
	var result = _joi2.default.validate(req.body, _validator2.default.questions);
	if (result.error) {
		return res.status(400).send(result.error.details[0].message);
	}
	var newQuestion = {
		question_id: _dbuser2.default.question.length + 1,
		createdOn: new Date().toLocaleString(),
		createdBy: req.body.user_id,
		meetup: req.body.meetup_id,
		title: req.body.title,
		body: req.body.body,
		vote: 0
	};
	_dbuser2.default.question.push(newQuestion);
	return res.json({
		status: 201,
		data: newQuestion,
		message: "Question successfully created"
	});
};
exports.upvote = function (req, res) {
	var upvoteQ = _dbuser2.default.question.find(function (c) {
		return c.question_id === parseInt(req.params.question_id);
	});
	if (!upvoteQ) {
		return res.json({
			status: 404,
			error: " No Question Found "
		});
	}
	upvoteQ.meetup = req.body.meetup;
	upvoteQ.title = req.body.title;
	upvoteQ.body = req.body.body;
	upvoteQ.vote += 1;
	return res.json({
		status: "201",
		data: upvoteQ,
		message: " upvote successfully!"
	});
};
exports.downVote = function (req, res) {
	var downVote = _dbuser2.default.question.find(function (c) {
		return c.question_id === parseInt(req.params.question_id);
	});
	if (!downVote) {
		return res.json({
			status: 404,
			error: " No Question Found "
		});
	}
	downVote.meetup = req.body.meetup;
	downVote.title = req.body.title;
	downVote.body = req.body.body;
	downVote.vote -= 1;
	return res.json({
		status: 201,
		data: downVote,
		message: "downvote successfull!"
	});
};
exports.createRvsp = function (req, res) {
	var meetup = _dbuser2.default.meetup.find(function (c) {
		return c.meetup_id === parseInt(req.params.meetup_id);
	});
	if (!meetup) {
		return res.json({
			status: "404",
			error: "No Meetup found"
		});
	}
	var result = _joi2.default.validate(req.body, _validator2.default.rsvp);
	if (result.error) {
		return res.status(400).send(result.error.details[0].message);
	}
	var newRsvp = {
		rsvp_id: _dbuser2.default.rsvp.length + 1,
		user: req.body.user,
		meetup: meetup.meetup_id,
		response: req.body.response
	};
	_dbuser2.default.question.push(newRsvp);
	return res.json({
		status: 201,
		data: newRsvp,
		message: "RSVP successfully created"
	});
};