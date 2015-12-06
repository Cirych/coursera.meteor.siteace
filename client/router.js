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
			let search = { websiteId: id }, searchValue;
			if (searchValue = Session.get("searchValue")) {
				searchValue = RegExp.escape(searchValue);
				search = { websiteId: id, body: { $regex: searchValue, $options: 'i' } };
			}
			let curItem = Websites.findOne({ _id: id });
			if (curItem == null) return {};
			let nextItem = Websites.find({ _id: { $gt: curItem._id } }, { sort: { _id: 1 }, limit: 1 }).fetch()[0];
			let prevItem = Websites.find({ _id: { $lt: curItem._id } }, { sort: { _id: -1 }, limit: 1 }).fetch()[0];
			return {
				item: curItem,
				next: nextItem ? { link: "/url/" + nextItem._id._str, enabled: "" } : { link: "#", enabled: "disabled" },
				prev: prevItem ? { link: "/url/" + prevItem._id._str, enabled: "" } : { link: "#", enabled: "disabled" },
				comments: Comments.find(search)
			}
		}
	});
});

Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

