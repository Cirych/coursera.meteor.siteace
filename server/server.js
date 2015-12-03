// DB for statistics, only server
/*
Websites._ensureIndex({
  "title": "text",
  "description": "text"
});
Comments._ensureIndex({
  "body": "text"
});
*/

Meteor.publish("websites", function (searchValue) {
  if (!searchValue)
    return Websites.find({});
  return Websites.find({ $text: { $search: searchValue } });
});
Meteor.publish("comments", function (searchValue) {
  if (!searchValue)
    return Comments.find({});
  return Comments.find({ $text: { $search: searchValue } });
});
Meteor.publish("recommends", function () {
  return Stats.find({ _id: this.userId });
});

Meteor.methods({
  addVoteUp(website_id) {
    let titleArr = Websites.findOne({ _id: website_id }).title.split(/\W+/);
    let recommends = [];
    titleArr.forEach(function (item) {
      if (item.length > 3) {
        Websites.find({ $text: { $search: item } }).forEach(function (website) {
          if (website._id != website_id &&
            !Stats.findOne({ _id: Meteor.userId(), voteup: website._id }))
            recommends.push(website._id);
        });
      }
    });
    Stats.update(
      { _id: Meteor.userId() },
      { $addToSet: { voteup: website_id, recommends: { $each: recommends } } },
      { upsert: true }
      );
    Stats.update(
      { _id: Meteor.userId() },
      { $pull: { recommends: website_id } },
      { upsert: true }
      );
  }
});
Meteor.methods({
  addVoteDown(website_id) {
    Stats.update(
      { _id: Meteor.userId() },
      { $addToSet: { votedown: website_id } },
      { upsert: true }
      );
  }
});

// start up function that creates entries in the Websites databases.
Meteor.startup(function () {
  // code to run on server at startup
  if (!Websites.findOne()) {
    console.log("No websites yet. Creating starter data.");
    var GoldsmithsId = Websites.insert({
    		title: "Goldsmiths Computing Department",
    		url: "http://www.gold.ac.uk/computing/",
    		description: "This is where this course was developed.",
      upVoted: 0,
      downVoted: 0,
    		createdOn: new Date()
    });

    Comments.insert({
      websiteId: GoldsmithsId,
      userId: null,
      author: null,
      createdOn: new Date(),
      body: "test1"
    });
    Comments.insert({
      websiteId: GoldsmithsId,
      userId: null,
      author: null,
      createdOn: new Date(),
      body: "test2"
    });

    Websites.insert({
    		title: "University of London",
    		url: "http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description: "University of London International Programme.",
      upVoted: 0,
      downVoted: 0,
    		createdOn: new Date()
    });
    Websites.insert({
    		title: "Coursera",
    		url: "http://www.coursera.org",
    		description: "Universal access to the world’s best education.",
      upVoted: 0,
      downVoted: 0,
    		createdOn: new Date()
    });
    Websites.insert({
    		title: "Google",
    		url: "http://www.google.com",
    		description: "Popular search engine.",
      upVoted: 0,
      downVoted: 0,
    		createdOn: new Date()
    });
  }
});