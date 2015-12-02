/* global Comments */
/* global Websites */
/* global Websites */

Websites = new Mongo.Collection("websites");
Comments = new Mongo.Collection('comments');
// set up security on Images collection
Websites.allow({
	insert(userId, doc){ 
    if (Meteor.user()){ 
      return true; 
    } else { 
      return false; 
    } 
  },
  update(userId, doc){ 
    if (Meteor.user()){ 
      return true; 
    } else { 
      return false; 
    } 
  },
	remove(userId, doc){ 
    if (userId){ 
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