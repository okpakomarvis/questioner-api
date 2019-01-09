import db from "../db/dbuser";
import Joi from "joi";
import validat from "../middleware/validator";

exports.createMeetup = (req, res) =>{
	// eslint-disable-next-line no-console
	const result = Joi.validate(req.body, validat.meetup);
	if(result.error){
		return res.status(400).send(result.error.details[0].message);
	} 
	const newMeetup = {
		meetup_id: db.meetup.length +1,
		createdOn: new Date().toLocaleString(),
		location: req.body.location,
		imagePath: req.file.path,
		topic: req.body.topic,
		happeningOn: new Date(req.body.happeningOn).toGMTString(),
		tag: req.body.tag
	};
	db.meetup.push(newMeetup);
	return res.json({
		status: 201,
		data: newMeetup,
		message:"Meetup successfully created"
	});
};
exports.singleMeetup =(req, res)=> {
	const singleMeetup = db.meetup.find(c=> c.meetup_id 
		=== parseInt(req.params.meetup_id));
	if(!singleMeetup){
		return res.json({
			status:"404",
			error:"No Meetup found"
		});
	}
	return res.json({
		status:200,
		data: singleMeetup,
		message: "Meetup retrieve successfully "
	});
};
exports.getMeetup = (req, res)=> {
	if(!db.meetup){
		return res.json({
			status: "500",
			error: "Internal Server Error"
		});
	}
	res.json({
		status: 200,
		count:db.meetup.length,
		data: db.meetup,
		message : "All Meetup retrieve successfully"
	});
};
exports.upcomingMeetup = (req, res) =>{
	const date = new Date().toLocaleString();
	let upmeetup = db.meetup.filter(obj=> {	
		return obj.happeningOn > date;
	});
	if(upmeetup.length ===0){
		return res.json({
			status: 404,
			error : "No Up ComingMeetup Found"
		});
	} 
	return res.json({
		status: 200,
		data: upmeetup,
		message: "All Up Coming Meetup retrieve Successfully"
	});
	
};
exports.createQuestion = (req, res) =>{
	const result = Joi.validate(req.body, validat.questions);
	if(result.error){
		return res.status(400).send(result.error.details[0].message);
	} 
	const newQuestion = {
		question_id: db.question.length +1,
		createdOn: new Date().toLocaleString(),
		createdBy:req.body.user_id,
		meetup:req.body.meetup_id,
		title:req.body.title,
		body:req.body.body,
		vote:0
	};
	db.question.push(newQuestion);
	return res.json({
		status: 201,
		data: newQuestion,
		message:"Question successfully created"
	});
	
};
exports.upvote = (req, res) => {
	const upvoteQ = db.question.find(c => c.question_id 
		=== parseInt(req.params.question_id));
	if(!upvoteQ) {
		return res.json({
			status: 404,
			error: " No Question Found "
		});
	}
	upvoteQ.meetup = req.body.meetup;
	upvoteQ.title = req.body.title;
	upvoteQ.body = req.body.body;
	upvoteQ.vote  += 1;
	return res.json({ 
		status:"201",
		data: upvoteQ,
		message: " upvote successfully!"
	});
};
exports.downVote = (req, res) => {
	const downVote = db.question.find(c => c.question_id 
		=== parseInt(req.params.question_id));
	if(!downVote) {
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
exports.createRvsp = (req, res) =>{
	const meetup = db.meetup.find(c=> c.meetup_id 
		=== parseInt(req.params.meetup_id));
	if(!meetup){
		return res.json({
			status:"404",
			error:"No Meetup found"
		});
	}
	const result = Joi.validate(req.body, validat.rsvp);
	if(result.error){
		return res.status(400).send(result.error.details[0].message);
	
	} 
	const newRsvp = {
		rsvp_id: db.rsvp.length +1,
		user:req.body.user,
		meetup:meetup.meetup_id,
		response:req.body.response
	};
	db.question.push(newRsvp);
	return res.json({
		status: 201,
		data: newRsvp,
		message:"RSVP successfully created"
	});
	
};
