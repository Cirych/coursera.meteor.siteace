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
	Session.set("searchValue", null);
	this.render('item', {
		to: "main",
		data() {
			Meteor.subscribe("websites");
			Meteor.subscribe("comments", Session.get("searchValue"));
			return {
				item: Websites.findOne({_id:this.params._id}),
				comments: Comments.find({websiteId: this.params._id})
			}
		}
	});
});

/////
// template helpers 
/////

// helper function that returns all available websites
Template.website_list.helpers({
	websites(){
		Meteor.subscribe("websites", Session.get("searchValue"));
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
	},
	recommends(){
		Meteor.subscribe("recommends");
		return Stats.findOne({recommends:this._id});
	}
});
Template.recommends.helpers({
	recommends(){
		//Meteor.subscribe("websites");
		//var recs = Stats.findOne({});
		//console.log(Stats.findOne({})._id);
		//return Websites.find();
	}
});

/////
// template events 
/////
Template.navbar.events({
	"submit #search":function(event){
		Session.set("searchValue", event.target.searchValue.value);
		return false;
	}
});

Template.website_item.events({
	"click .js-upvote":function(event){
		var website_id = this._id;
		Websites.update({_id:website_id},{$inc:{upVoted:1}});
		Meteor.call("addVoteUp", website_id);
		return false;
	}, 
	"click .js-downvote":function(event){
		var website_id = this._id;
		Websites.update({_id:website_id},{$inc:{downVoted:1}});
		Meteor.call("addVoteDown", website_id);
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

