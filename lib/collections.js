Websites = new Mongo.Collection("websites",{idGeneration: "MONGO"});
Comments = new Mongo.Collection("comments",{idGeneration: "MONGO"});

// set up security on Images collection
Websites.allow({
  insert(userId, doc) {
    if (Meteor.user()) {
      return true;
    } else {
      return false;
    }
  },
  update(userId, doc) {
    if (Meteor.user()) {
      return true;
    } else {
      return false;
    }
  },
  remove(userId, doc) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  }
})

Comments.allow({
  insert(userId, doc) {
    if (Meteor.user()) {
      return true;
    } else {
      return false;
    }
  }
})