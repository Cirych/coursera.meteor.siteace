Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection('comments');
Stats = new Mongo.Collection("statistic");
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