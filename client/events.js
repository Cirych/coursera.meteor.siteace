Template.navbar.events({
	"submit #search": function (event) {
		Session.set("searchValue", event.target.searchValue.value.trim());
		return false;
	},
	"click #searchRemove": function (event) {
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
	"click .js-downvote": function () {
		downVote(this);
		return false;
	}
});
Template.item.events({
	"click .js-upvote": function () {
		upVote(this.item);
		return false;
	},
	"click .js-downvote": function () {
		downVote(this.item);
		return false;
	}
});

Template.welcome.events({
	"click .js-toggle-website-form": function (event) {
		$("#website_form").modal('show');
	},
	"submit .js-save-website-form": function (event) {
		if (Meteor.user()) {
			Websites.insert({
				title: event.target.title.value,
				url: event.target.url.value,
				description: event.target.description.value,
				upVoted: 0,
				downVoted: 0,
				createdOn: new Date(),
				createdBy: Meteor.user()._id
			});
		}
		$("#website_form").modal('hide');
		return false;
	},
	"blur #url": function (event) {
		let url = event.target.value;
		let formGroup = event.target.form.children[0].classList;
		if (url) {
			extractMeta(url, function (err, res) {
				if (!$.isEmptyObject(res)) {
					event.target.form[1].value = res.title || "";
					event.target.form[2].value = res.description || "";
					formGroup.toggle("has-error", false);
					formGroup.toggle("has-success");
				}
				else {
					event.target.form[1].value = "";
					event.target.form[2].value = "";
					formGroup.toggle("has-success", false);
					formGroup.toggle("has-error");
				}
			});
		}
	}
});
Template.item.events({
	"submit .js-save-comment-form": function (event) {
		//console.log(this.item._id);
		if (Meteor.user()) {
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
	"click .js-toggle-help": function (event) {
		$("#help").modal('show');
	}
});