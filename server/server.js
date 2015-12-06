// DB for statistics, only server
Meteor.publish("websites", function () {
    return Websites.find({});
});
Meteor.publish("comments", function () {
    return Comments.find({});
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
    		createdOn: new Date(),
        createdByName: "FireStarter"
    });

    Comments.insert({
      websiteId: GoldsmithsId,
      userId: null,
      author: "FireStarter",
      createdOn: new Date(),
      body: "test1"
    });
    Comments.insert({
      websiteId: GoldsmithsId,
      userId: null,
      author: "FireStarter",
      createdOn: new Date(),
      body: "test2"
    });

    Websites.insert({
    		title: "University of London",
    		url: "http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
    		description: "University of London International Programme.",
      upVoted: 0,
      downVoted: 0,
    		createdOn: new Date(),
        createdByName: "FireStarter"
    });
    Websites.insert({
    		title: "Coursera",
    		url: "http://www.coursera.org",
    		description: "Universal access to the world’s best education.",
      upVoted: 0,
      downVoted: 0,
    		createdOn: new Date(),
        createdByName: "FireStarter"
    });
    Websites.insert({
    		title: "Google",
    		url: "http://www.google.com",
    		description: "Popular search engine.",
      upVoted: 0,
      downVoted: 0,
    		createdOn: new Date(),
        createdByName: "FireStarter"
    });
  }
});