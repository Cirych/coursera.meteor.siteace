/////
// routing 
/////

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	Session.set("searchValue", null);
	this.render('welcome', {
		to: "welcome"
	});
	this.render('website_list', {
		to: "main"
	});
});
Router.route('/url', function () {
	Session.set("searchValue", null);
	this.render('website_list', {
		to: "main"
	});
});
Router.route('/url/:_id', function () {
	Session.set("searchValue", null);
	this.render('item', {
		to: "main",
		data() {
			let id = new Meteor.Collection.ObjectID(this.params._id);
			Meteor.subscribe("websites");
			Meteor.subscribe("comments");
			let search = {websiteId: id}, searchValue;
			if (searchValue = Session.get("searchValue")) {
				searchValue = RegExp.escape(searchValue);
				search = {websiteId: id, body:{ $regex: searchValue, $options: 'i' } };
			}
			let curItem = Websites.findOne({_id:id});
			if(curItem == null) return {};
			let nextItem = Websites.find({_id:{$gt:curItem._id}},{sort: {_id: 1}, limit: 1}).fetch()[0];
			let prevItem = Websites.find({_id:{$lt:curItem._id}},{sort: {_id: -1}, limit: 1}).fetch()[0];
			return {
				item: curItem,
				next: nextItem?{link:"/url/"+nextItem._id._str, enabled:""}:{link:"#", enabled:"disabled"},
				prev: prevItem?{link:"/url/"+prevItem._id._str, enabled:""}:{link:"#", enabled:"disabled"},
				comments: Comments.find(search)
			}
		}
	});
});

/////
// template helpers 
/////

// helper function that returns all available websites
Template.navbar.helpers({
	searchValue(){
		return Session.get("searchValue");
	}
});
Template.website_list.helpers({
	websites(){
		//Meteor.subscribe("websites", Session.get("searchValue"));
		Meteor.subscribe("websites");
		let search = {}, searchValue;
		if(searchValue = Session.get("searchValue")) {
			searchValue = RegExp.escape(searchValue);
			search = {$or:[{title:{$regex:searchValue,$options:'i'}},{description:{$regex:searchValue,$options:'i'}}]};
		}
		return Websites.find(search, {sort:{upVoted: -1}});
	}
});
Template.website_item.helpers({
	recommends(){
		return Meteor.users.findOne({'profile.recommends':this._id});
	}
});

/////
// template events 
/////
Template.navbar.events({
	"submit #search":function(event){
		Session.set("searchValue", event.target.searchValue.value.trim());
		return false;
	},
	"click #searchRemove":function(event){
		Session.set("searchValue", null);
		searchValue.value = null;
		return false;
	}
});

Template.website_item.events({
	"click .js-upvote": function () {
		upVote(this);
		return false;
	},
	"click .js-downvote": function() {
		downVote(this);
		return false;
	}
});
Template.item.events({
	"click .js-upvote": function () {
		upVote(this.item);
		return false;
	},
	"click .js-downvote": function() {
		downVote(this.item);
		return false;
	}
});

Template.welcome.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").modal('show');
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
	},
	"blur #url":function(event){
		let url = event.target.value;
		let formGroup = event.target.form.children[0].classList;
		if(url) {
			extractMeta(url, function (err, res) {
				if(!$.isEmptyObject(res)) {
					event.target.form[1].value = res.title || "";
					event.target.form[2].value = res.description || "";
					formGroup.toggle("has-error",false);
					formGroup.toggle("has-success");
				}
				else {
					event.target.form[1].value = "";
					event.target.form[2].value = "";
					formGroup.toggle("has-success",false);
					formGroup.toggle("has-error");
				}
			});
		}
	}
});
Template.item.events({
	"submit .js-save-comment-form":function(event){
		//console.log(this.item._id);
		if (Meteor.user()){
		Comments.insert({
    		websiteId: this.item._id,
    		userId: Meteor.user()._id, 
    		author: Meteor.user().username,
			createdOn: new Date(),
			body: event.target.newcomment.value
    	});
		}
		event.target.newcomment.value = "";
		return false;
	}
});

Template.footer.events({
	"click .js-toggle-help":function(event){
		$("#help").modal('show');
	}
});

///Global helpers

Template.registerHelper('prettyDate', function(date) {
	return moment(date).calendar();
});
Template.registerHelper('_id', function() {
	return this._id._str;
});
Template.registerHelper('getUser', function(userId) {
	let user = Meteor.users.findOne({_id:userId});
		if(user)
			return user.username;
		else
			return "anon";
});
Template.registerHelper('isEnabled', function() {
	return Meteor.user()?"":"disabled";;
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