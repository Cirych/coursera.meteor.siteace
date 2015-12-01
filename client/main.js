/* global Websites */
/* global Template */
/* global Router */
/* global $ */

/////
// routing 
/////
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	this.render('welcome', {
		to: "welcome"
	});
	this.render('website_list', {
		to: "main"
	});
});
Router.route('/url/:_id', function () {
	this.render('item', {
		to: "main",
		data() {
			return Websites.findOne({_id:this.params._id});
		}
	});
});

/////
// template helpers 
/////

// helper function that returns all available websites
Template.website_list.helpers({
	websites(){
		return Websites.find({}, {sort:{upVoted: -1}});
	}
});
Template.website_item.helpers({
	getUser(user_id){
		let user = Meteor.users.findOne({_id:user_id});
		if(user)
			return user.username;
		else
			return "anon";
	},
	isEnabled() {
		return Meteor.user()?"":"disabled";
	}
});

/////
// template events 
/////

Template.website_item.events({
	"click .js-upvote":function(event){
		var website_id = this._id;
		Websites.update({_id:website_id},{$inc:{upVoted:1}});
		return false;
	}, 
	"click .js-downvote":function(event){
		var website_id = this._id;
		Websites.update({_id:website_id},{$inc:{downVoted:1}});
		return false;
	}
})

Template.welcome.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").modal('show');
		console.log('show modal add form');
	},
	"submit .js-save-website-form":function(event){
		if (Meteor.user()){
		Websites.insert({
    		title: event.target.title.value,
    		url: event.target.url.value, 
    		description: event.target.description.value,
			upVoted: 0,
			downVoted: 0,
    		createdOn:new Date(),
			createdBy:Meteor.user()._id
    	});
		}
		$("#website_form").modal('hide');
		return false;
	}
});

///Global helpers

Template.registerHelper('prettyDate', function(date) {
	return moment(date).calendar();
});

/// accounts config

Accounts.ui.config({
passwordSignupFields: "USERNAME_AND_EMAIL"
});

Template.welcome.helpers({username:function(){
if (Meteor.user()){
  return Meteor.user().username;
    //return Meteor.user().emails[0].address;
}
else {
  return "anonymous internet user";
}
}
});

