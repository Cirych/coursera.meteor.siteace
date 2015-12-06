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
	},
	upEnabled(){
		let voted = Meteor.users.findOne({'profile.voteup': this._id});
		return voted?"disabled":"";
	},
	downEnabled(){
		let voted = Meteor.users.findOne({'profile.votedown': this._id});
		return voted?"disabled":"";
	}
});
Template.item.helpers({
	recommends(){
		return Meteor.users.findOne({'profile.recommends':this.item._id});
	},
	upEnabled(){
		let voted = Meteor.users.findOne({'profile.voteup': this.item._id});
		return voted?"disabled":"";
	},
	downEnabled(){
		let voted = Meteor.users.findOne({'profile.votedown': this.item._id});
		return voted?"disabled":"";
	}
});
Template.welcome.helpers({
	username: function () {
		if (Meteor.user()) {
			return Meteor.user().username;
			//return Meteor.user().emails[0].address;
		}
		else {
			return "anonymous internet user";
		}
	}
});

Template.registerHelper('prettyDate', function(date) {
	return moment(date).calendar();
});
Template.registerHelper('_id', function() {
	return this._id._str;
});
Template.registerHelper('isEnabled', function() {
	return Meteor.user()?"":"disabled";;
});