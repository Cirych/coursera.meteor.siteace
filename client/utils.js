///
// utils
///
RegExp.escape = function (s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

upVote = function (item) {
	var website_id = item._id;
	let voted = Meteor.users.findOne(
		{ 'profile.voteup': website_id }
		);
	if (!voted) {
		let downVoted = Meteor.users.findOne(
			{ 'profile.votedown': website_id }
			);
		if (downVoted) Websites.update({ _id: website_id }, { $inc: { downVoted: -1 } });
		Websites.update({ _id: website_id }, { $inc: { upVoted: 1 } });
		let titleArr = item.title.split(/\W+/);
		let recommends = titleArr.reduce(function (arr, item) {
			if (item.length > 3) {
				return Websites.find({ $or: [{ title: { $regex: item, $options: 'i' } }, { description: { $regex: item, $options: 'i' } }] })
					.map(function (website) { return website._id })
					.filter(function (website) { return website != website_id._str; })
					.concat(arr);
			}
			return arr;
		}, []);
		Meteor.users.update(
			{ _id: Meteor.userId() },
			{
				$addToSet: { 'profile.voteup': website_id, 'profile.recommends': { $each: recommends } }
			}
			);
		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $pull: { 'profile.votedown': website_id } }
			);
		Meteor.users.update(
			{ _id: Meteor.userId() },
			{ $pull: { 'profile.recommends': website_id } }
			);
		return true;
	}
	return false;
};
downVote = function (item) {
	let website_id = item._id;
	let voted = Meteor.users.findOne(
		{ 'profile.votedown': website_id }
		);
	if (!voted) {
		let upVoted = Meteor.users.findOne(
			{ 'profile.voteup': website_id }
			);
		Websites.update({ _id: website_id }, { $inc: { downVoted: 1 } });
		if (upVoted) Websites.update({ _id: website_id }, { $inc: { upVoted: -1 } });
		Meteor.users.update(
			{ _id: Meteor.userId() },
			{
				$addToSet: { 'profile.votedown': website_id }
			}
			);
		Meteor.users.update(
			{ _id: Meteor.userId() },
			{
				$pull: { 'profile.voteup': website_id }
			}
			);
		return true;
	}
	return false;
};